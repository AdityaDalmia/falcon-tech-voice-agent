const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// This file handles Google Calendar integration.
// To use this, you need a Service Account JSON key from Google Cloud Console.
// Save it as 'credentials.json' in this folder.

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
let calendar;

try {
  const credentialsPath = path.join(__dirname, 'credentials.json');
  if (fs.existsSync(credentialsPath)) {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: SCOPES,
    });
    calendar = google.calendar({ version: 'v3', auth });
    console.log('Google Calendar successfully initialized.');
  } else {
    console.log('Warning: credentials.json not found. Calendar functions will be mocked.');
  }
} catch (error) {
  console.error('Error initializing Google Calendar:', error.message);
}

// Function to check availability
async function checkAvailability(dateStr) {
  if (!calendar) {
    console.log(`[Mock] Checking availability for ${dateStr}`);
    return "Available times: 10 AM, 2 PM, 4 PM.";
  }
  
  // Real implementation for checking free/busy
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const timeMin = new Date(dateStr).toISOString();
    const timeMax = new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString();
    
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = response.data.items;
    if (events.length === 0) {
      return "The whole day is free.";
    }
    // Simple mock logic based on events
    return `You have ${events.length} appointments on this day. Please specify a time to check.`;
  } catch (error) {
    console.error('Calendar API Error:', error);
    return "Error checking calendar.";
  }
}

// Function to book an appointment
async function bookAppointment(name, dateStr, timeStr) {
  if (!calendar) {
    console.log(`[Mock] Booking appointment for ${name} at ${dateStr} ${timeStr}`);
    return `Booking confirmed for ${name} on ${dateStr} at ${timeStr}.`;
  }

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    // Combine date and time, very simplified for demonstration
    const startDateTime = new Date(`${dateStr} ${timeStr}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour

    const event = {
      summary: `Appointment with ${name}`,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });
    
    return `Booking confirmed. Event link: ${response.data.htmlLink}`;
  } catch (error) {
    console.error('Calendar API Error:', error);
    return "Failed to book appointment due to calendar error.";
  }
}

module.exports = {
  checkAvailability,
  bookAppointment
};
