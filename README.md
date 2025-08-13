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
├── index.js                        # Entry point
├── services/
│   └── NotificationService.js      # Client-side notification utilities
├── assets/                         # App icons and images
│   ├── icon.png                   # App icon
│   ├── adaptive-icon.png          # Android adaptive icon
│   ├── splash-icon.png            # Splash screen image
│   └── favicon.png                # Web favicon
├── package.json                   # React Native app dependencies
├── app.json                       # Expo configuration with project ID
├── eas.json                       # EAS Build configuration
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
- React 19.0.0 and React Native 0.79.5
- Uses `expo-notifications` (~0.31.4) for notification handling
- Uses `expo-device` (~7.1.4) for device detection
- Uses `expo-dev-client` (~5.2.4) for development
- Supports both Android and iOS platforms
- Implements proper notification channels for Android

## Remote Push Notifications

This project demonstrates how to receive remote push notifications using Expo's push notification service:

### 🌐 Method 1: Expo Push Tool (Web Interface)

1. Copy your push token from the app
2. Visit: https://expo.dev/notifications
3. Paste your token and send a test notification

### 💻 Method 2: Command Line (cURL)

Send directly:
```bash
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "YOUR_PUSH_TOKEN_HERE",
  "title": "Hello from cURL!",
  "body": "This is a test notification"
}'
```


### 📦 Production Implementation

For production use:
- Implement user authentication and token management
- Add rate limiting and error handling
- Store push tokens in a database
- Set up monitoring and logging
- Use environment variables for configuration
- Build a backend service to send notifications via Expo's API

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

### **Issue: Remote notifications not working**
- **Solution:** Use Expo Push Tool (https://expo.dev/notifications) to test
- **Debug:** Check that your push token is valid and device has internet connection
- **Alternative:** Use cURL to send notifications directly to Expo's API

### **Common Issues:**
- **Notifications not appearing**: Ensure you're testing on a physical device
- **Permission denied**: Check device notification settings  
- **Token not generated**: Verify internet connection and device compatibility
- **Remote notifications not received**: Verify push token is correct and try using Expo Push Tool