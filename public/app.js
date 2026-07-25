import Vapi from 'https://esm.sh/@vapi-ai/web@latest';

// =========================================================================
// ACTION REQUIRED: PUT YOUR VAPI PUBLIC KEY HERE
// Go to https://dashboard.vapi.ai/ -> API Keys -> Public Key
// =========================================================================
const VAPI_PUBLIC_KEY = '418cbd4f-20e9-4359-a0d5-a56af1fe360f';

// =========================================================================
// ACTION REQUIRED: PUT YOUR VAPI ASSISTANT ID HERE
// Go to https://dashboard.vapi.ai/ -> Assistants -> Copy the ID of your first assistant
// =========================================================================
const ASSISTANT_ID = 'ea6aad2e-23f2-4b64-9a38-9fb14f55f2e8';

let vapi;
try {
    vapi = new Vapi(VAPI_PUBLIC_KEY);
} catch (e) {
    alert("Initialization Error: " + e.message);
}

// DOM Elements
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const statusTextEl = document.getElementById('status');
const statusContainer = document.getElementById('status-container');
const orb = document.getElementById('orb');

function setStatus(text, state) {
    statusTextEl.textContent = text;
    statusContainer.className = `status-badge ${state}`;
}

startBtn.addEventListener('click', async () => {
    if (VAPI_PUBLIC_KEY === 'YOUR_VAPI_PUBLIC_KEY_HERE') {
        alert('Please add your Vapi Public Key in app.js first!');
        return;
    }

    if (ASSISTANT_ID === 'YOUR_ASSISTANT_ID') {
        alert('Please add your Assistant ID in app.js first!');
        return;
    }

    startBtn.classList.add('hidden');
    setStatus('Connecting to Vapi...', 'connecting');

    try {
        // Start the call using the Assistant ID from dashboard
        await vapi.start(ASSISTANT_ID, {
            // serverUrl: "https://rtzrs-146-196-38-160.free.pinggy.net/api/webhook",
            // serverMessages: ["tool-calls"]
        });
    } catch (err) {
        console.error(err);
        setStatus('Connection Error', 'disconnected');
        startBtn.classList.remove('hidden');
        alert("Vapi Connection Error: " + (err.message || JSON.stringify(err)));
    }
});

endBtn.addEventListener('click', () => {
    vapi.stop();
});

// Vapi Events
vapi.on('call-start', () => {
    setStatus('Connected', 'connected');
    endBtn.classList.remove('hidden');
    orb.classList.add('active');
});

vapi.on('call-end', () => {
    setStatus('Disconnected', 'disconnected');
    startBtn.classList.remove('hidden');
    endBtn.classList.add('hidden');
    orb.classList.remove('active');
});

vapi.on('error', (e) => {
    console.error('Vapi Error:', e);
    const errorMsg = e.message || (typeof e === 'string' ? e : JSON.stringify(e));
    setStatus('Error: ' + errorMsg, 'disconnected');
    startBtn.classList.remove('hidden');
    endBtn.classList.add('hidden');
    orb.classList.remove('active');
    alert("Vapi SDK Error: " + errorMsg);
});
