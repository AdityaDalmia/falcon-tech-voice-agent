require('dotenv').config();
const express = require('express');
const { checkAvailability, bookAppointment } = require('./calendar');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve the web frontend

// Simple GET route to verify webhook server status in browser
app.get('/api/webhook', (req, res) => {
    res.send('Vapi Webhook Endpoint is Live and Ready!');
});

// Vapi Webhook for Custom Tools
app.post('/api/webhook', async (req, res) => {
    try {
        const payload = req.body;
        
        // Vapi sends a 'toolCall' message when it needs to run a tool
        if (payload.message && payload.message.type === 'tool-calls') {
            const toolCall = payload.message.toolCalls[0];
            const functionName = toolCall.function.name;
            const args = toolCall.function.arguments; // Vapi already parses this to an object
            
            console.log(`Vapi called tool: ${functionName} with args:`, args);
            
            let result = "";
            
            if (functionName === 'checkAvailability') {
                result = await checkAvailability(args.dateStr);
            } else if (functionName === 'bookAppointment') {
                result = await bookAppointment(args.name, args.dateStr, args.timeStr);
            } else {
                result = "Unknown function called.";
            }

            // Vapi expects this exact response format
            return res.json({
                results: [
                    {
                        toolCallId: toolCall.id,
                        result: result
                    }
                ]
            });
        }
        
        res.json({ message: 'Unhandled webhook type' });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Start HTTP Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Make sure to use ngrok if you need to expose your webhook to Vapi: ngrok http ${PORT}`);
});
