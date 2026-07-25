# Ava Voice Agent

This project creates a voice-based AI assistant ("Ava") that can take phone calls via Twilio, process them using OpenAI's Realtime API, and check/book appointments using Google Calendar. 
It supports both English and Hindi.

## Prerequisites

Since you are starting from scratch, here is exactly what you need to do to get this running.

### 1. OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com/).
2. Sign up or log in. Add a payment method (billing) to your account, as the Realtime API requires it.
3. Go to **API Keys** and create a new secret key.
4. Rename `.env.example` to `.env` in this folder, and paste your key next to `OPENAI_API_KEY`.

### 2. Twilio Setup
1. Go to [Twilio](https://www.twilio.com/) and sign up for a free account.
2. Go to the Twilio Console and click **Get a Trial Phone Number**.
3. You will use this phone number later to call your agent.

### 3. Google Calendar Setup (Optional but recommended)
If you don't do this, Ava will still work, but she will just "mock" the bookings and print them in the console.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Go to **APIs & Services > Library**, search for "Google Calendar API", and enable it.
4. Go to **Credentials**, click **Create Credentials**, and choose **Service Account**.
5. Once created, click on the Service Account, go to the **Keys** tab, click **Add Key > Create new key**, and select **JSON**.
6. A JSON file will be downloaded to your computer. Rename it to `credentials.json` and place it in this project folder (`ava-voice-agent`).
7. Open that JSON file, find the `client_email` address. Go to your actual Google Calendar in the browser, go to Settings -> "Share with specific people", and give that `client_email` permission to "Make changes to events".
8. (Optional) Set `GOOGLE_CALENDAR_ID` in your `.env` file if you are using a specific calendar, otherwise 'primary' uses the service account's own calendar.

## How to Run

1. Open a terminal in this folder and install dependencies:
   ```bash
   npm install
   ```
2. Start the Node.js server:
   ```bash
   npm start
   ```
   *The server will start on port 3000.*

3. Because Twilio needs a public URL to send the call to, you need to expose your local port 3000 to the internet. Use [ngrok](https://ngrok.com/):
   ```bash
   ngrok http 3000
   ```
4. Copy the `https` URL that ngrok gives you (e.g., `https://abcdef.ngrok.app`).
5. Go to your Twilio Console -> Phone Numbers -> Manage -> Active Numbers -> Click your number.
6. Scroll down to the **Voice** section.
7. Under "A CALL COMES IN", select "Webhook", paste your ngrok URL and add `/incoming-call` to the end.
   - Example: `https://abcdef.ngrok.app/incoming-call`
   - Make sure HTTP POST is selected.
   - Save.

8. Call your Twilio phone number from your real phone. **Ava will answer!**
