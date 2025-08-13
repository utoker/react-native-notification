# React Native Push Notifications Demo

A comprehensive React Native app built with Expo SDK that demonstrates push notification capabilities.

## Features

- **Permission Management**: Request and check notification permissions
- **Local Notifications**: Schedule and send local notifications with custom timing
- **Push Token Generation**: Generate and display Expo push tokens for remote notifications
- **Interactive UI**: User-friendly interface to test different notification features
- **Real-time Feedback**: Display received notifications and their content

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Physical device (for testing push notifications)
- Expo account (for push token generation)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd NotificationDemo
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Use the Expo Go app to scan the QR code or run on an emulator

**Note**: The Expo project is already configured with project ID `1168fc6b-4a4a-43b5-aab2-85a3f39898fb`. Push tokens should work out of the box.

### Testing on Device

For the best experience, test on a physical device as push notifications require device capabilities that aren't fully available in simulators/emulators.

## How to Use

1. **Grant Permissions**: Tap "Request Permissions" to allow notifications
2. **Schedule Notifications**: 
   - Enter custom title and body text
   - Set delay in seconds
   - Tap "Schedule" to schedule or "Send Now" for immediate delivery
3. **View Push Token**: The app displays your Expo push token for remote notifications
4. **Cancel Notifications**: Use "Cancel All" to clear scheduled notifications

## Project Structure

```
NotificationDemo/
├── App.js                          # Main app component with UI
├── services/
│   └── NotificationService.js      # Client-side notification utilities
├── server/                         # Node.js backend server
│   ├── package.json               # Server dependencies
│   └── server.js                  # Express server with push endpoints
├── scripts/                       # Testing and example scripts
│   ├── send_push_notification.py  # Python script for sending notifications
│   └── curl_examples.sh           # cURL command examples
├── package.json                   # React Native app dependencies
├── app.json                       # Expo configuration with project ID
└── README.md                      # Documentation
```

## Key Components

### NotificationService.js
- `requestPermissions()` - Handle notification permissions
- `getPushToken()` - Generate Expo push token
- `schedulePushNotification()` - Schedule local notifications
- `cancelAllScheduledNotifications()` - Cancel all scheduled notifications

### App.js
- Main UI component with notification controls
- Permission status display
- Interactive notification scheduling
- Real-time notification display

## Technical Details

- Built with Expo SDK 53
- Uses `expo-notifications` for notification handling
- Uses `expo-device` for device detection
- Supports both Android and iOS platforms
- Implements proper notification channels for Android

## Remote Push Notifications

This project includes multiple ways to test and implement remote push notifications:

### 🖥️ Method 1: Local Node.js Server

#### For Local Development (WiFi allows device-to-device connections):
1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Server will run on:** `http://localhost:3000`
3. **In the app:** Use default server URL (`http://localhost:3000`)

#### For Tunnel Mode (Managed WiFi, blocked device-to-device):
1. **Start server with ngrok tunnel:**
   ```bash
   cd server
   ./start-with-ngrok.sh
   ```

2. **Copy the ngrok URL** from the terminal output (e.g., `https://abc123.ngrok.io`)

3. **In the app:** 
   - Tap "Server Config" in Remote Notifications section
   - Update Server URL to your ngrok URL
   - Use "Send via Server" button

#### Available endpoints:
- `POST /send-notification` - Send single notification
- `POST /send-batch-notifications` - Send multiple notifications  
- `POST /check-receipts` - Check notification delivery status
- `POST /validate-token` - Validate push token format
- `GET /health` - Server health check

### 🌐 Method 2: Expo Push Tool (Web Interface)

1. Copy your push token from the app
2. Visit: https://expo.dev/notifications
3. Paste your token and send a test notification

### 💻 Method 3: Command Line (cURL)

Run the cURL examples script:
```bash
./scripts/curl_examples.sh
```

Or send directly:
```bash
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "YOUR_PUSH_TOKEN_HERE",
  "title": "Hello from cURL!",
  "body": "This is a test notification"
}'
```

### 🐍 Method 4: Python Script

Run the Python example:
```bash
python3 scripts/send_push_notification.py "YOUR_PUSH_TOKEN" "Title" "Body"
```

### 📦 Production Implementation

For production use:
- Use the server code as a starting point
- Implement user authentication and token management
- Add rate limiting and error handling
- Store push tokens in a database
- Set up monitoring and logging
- Use environment variables for configuration

### 🔍 Error Handling

Common error codes:
- `DeviceNotRegistered` - Token is no longer valid
- `MessageTooBig` - Notification payload exceeds 4KB
- `MessageRateExceeded` - Sending too many notifications
- `InvalidCredentials` - Authentication issues

## Troubleshooting

### **Issue: Scheduled notifications appear instantly**
- **Solution:** Updated with improved timing validation and logging
- **Debug:** Use "Show Scheduled" button to verify scheduling
- **Check:** Console logs show detailed timing information
- **Note:** Delays are capped between 1 second and 1 hour for reliability

### **Issue: Remote notifications fail in tunnel mode**
- **Cause:** Managed WiFi blocks device-to-device connections
- **Solution 1:** Use ngrok tunnel with `./start-with-ngrok.sh`
- **Solution 2:** Configure custom server URL in app settings
- **Solution 3:** Use Expo Push Tool (https://expo.dev/notifications)
- **Debug:** Check console for connection errors and URLs

### **Common Issues:**
- **Notifications not appearing**: Ensure you're testing on a physical device
- **Permission denied**: Check device notification settings  
- **Token not generated**: Verify internet connection and device compatibility
- **Server connection failed**: Check if server is running and accessible
- **ngrok URL not working**: Ensure ngrok is installed and tunnel is active