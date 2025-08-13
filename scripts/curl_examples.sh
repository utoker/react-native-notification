#!/bin/bash

# Expo Push Notification cURL Examples
# Replace YOUR_PUSH_TOKEN_HERE with your actual Expo push token

echo "🚀 Expo Push Notification cURL Examples"
echo "========================================"
echo

# Set your push token here
PUSH_TOKEN="ExponentPushToken[YOUR_PUSH_TOKEN_HERE]"

if [ "$PUSH_TOKEN" = "ExponentPushToken[YOUR_PUSH_TOKEN_HERE]" ]; then
    echo "⚠️  Please update the PUSH_TOKEN variable with your actual token"
    echo "   You can find your token in the React Native app"
    echo
fi

echo "📱 1. Send Single Notification (Direct to Expo API)"
echo "---------------------------------------------------"
curl_cmd_direct='curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '"'"'{
  "to": "'$PUSH_TOKEN'",
  "title": "Hello from cURL!",
  "body": "This notification was sent using cURL directly to Expo API",
  "sound": "default",
  "data": {
    "source": "curl_direct",
    "timestamp": "'$(date +%s)'"
  }
}'"'"

echo "$curl_cmd_direct"
echo
echo "▶️  Run this command:"
echo "$curl_cmd_direct"
echo
echo

echo "🖥️  2. Send via Local Server (localhost:3000)"
echo "----------------------------------------------"
curl_cmd_local='curl -H "Content-Type: application/json" -X POST "http://localhost:3000/send-notification" -d '"'"'{
  "pushToken": "'$PUSH_TOKEN'",
  "title": "Hello from Local Server!",
  "body": "This notification was sent via the local Node.js server",
  "data": {
    "source": "curl_local_server",
    "timestamp": "'$(date +%s)'"
  }
}'"'"

echo "$curl_cmd_local"
echo
echo "▶️  Run this command (ensure server is running):"
echo "$curl_cmd_local"
echo
echo

echo "📦 3. Send Batch Notifications (Direct to Expo API)"
echo "---------------------------------------------------"
curl_cmd_batch='curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '"'"'[
  {
    "to": "'$PUSH_TOKEN'",
    "title": "Batch Notification #1",
    "body": "First notification in the batch",
    "data": {"index": 1}
  },
  {
    "to": "'$PUSH_TOKEN'",
    "title": "Batch Notification #2", 
    "body": "Second notification in the batch",
    "data": {"index": 2}
  }
]'"'"

echo "$curl_cmd_batch"
echo
echo "▶️  Run this command:"
echo "$curl_cmd_batch"
echo
echo

echo "🧪 4. Validate Push Token"
echo "-------------------------"
curl_cmd_validate='curl -H "Content-Type: application/json" -X POST "http://localhost:3000/validate-token" -d '"'"'{
  "pushToken": "'$PUSH_TOKEN'"
}'"'"

echo "$curl_cmd_validate"
echo
echo "▶️  Run this command:"
echo "$curl_cmd_validate"
echo
echo

echo "📋 5. Check Notification Receipts"
echo "---------------------------------"
echo "First, send a notification and get the receipt ID, then:"
curl_cmd_receipts='curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '"'"'{
  "ids": ["RECEIPT_ID_HERE"]
}'"'"

echo "$curl_cmd_receipts"
echo
echo "▶️  Replace RECEIPT_ID_HERE with actual receipt ID from previous notification"
echo
echo

echo "🏥 6. Server Health Check"
echo "------------------------"
curl_cmd_health='curl -X GET "http://localhost:3000/health"'

echo "$curl_cmd_health"
echo
echo "▶️  Run this command:"
echo "$curl_cmd_health"
echo
echo

echo "📊 7. Server API Documentation"
echo "------------------------------"
curl_cmd_docs='curl -X GET "http://localhost:3000/"'

echo "$curl_cmd_docs"
echo
echo "▶️  Run this command:"
echo "$curl_cmd_docs"
echo
echo

echo "💡 Tips:"
echo "--------"
echo "• Make sure your push token starts with 'ExponentPushToken[' or 'ExpoPushToken['"
echo "• For local server commands, ensure the Node.js server is running: cd server && npm start"
echo "• Test on a physical device - simulators/emulators don't support push notifications"
echo "• Use https://expo.dev/notifications for web-based testing"
echo "• Check the app console/logs for detailed error information"
echo
echo "🔧 Setup Server:"
echo "cd server"
echo "npm install"
echo "npm start"
echo