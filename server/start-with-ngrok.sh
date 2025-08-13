#!/bin/bash

echo "🚀 Starting Expo Push Notification Server with ngrok tunnel..."
echo "============================================================="

# Start the server in background
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

echo "📱 Server started with PID: $SERVER_PID"

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 3000 --log stdout | while read line; do
  echo "$line"
  # Extract the public URL from ngrok output
  if [[ $line == *"url=https://"* ]]; then
    NGROK_URL=$(echo $line | grep -o 'url=https://[^[:space:]]*' | cut -d'=' -f2)
    echo "✅ Public URL: $NGROK_URL"
    echo ""
    echo "🔗 Use this URL in your Expo app:"
    echo "   Replace 'http://localhost:3000' with '$NGROK_URL'"
    echo ""
    echo "📋 Example endpoints:"
    echo "   POST $NGROK_URL/send-notification"
    echo "   GET  $NGROK_URL/health"
    echo ""
    echo "💡 Update your React Native app to use: $NGROK_URL"
    echo "   (Check the Remote Notifications section)"
    break
  fi
done

# Clean up when script exits
trap "echo 'Stopping server...'; kill $SERVER_PID; exit" INT TERM EXIT