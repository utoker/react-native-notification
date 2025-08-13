#!/bin/bash

echo "🚀 Starting Expo Push Notification Server with Serveo SSH tunnel..."
echo "=================================================================="

# Start the server in background
echo "🖥️  Starting Node.js server..."
node server.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🌐 Creating SSH tunnel with Serveo..."
echo "⚠️  Note: This may prompt for SSH host verification - type 'yes'"
echo ""

# Create SSH tunnel
echo "🔗 Starting tunnel... (Press Ctrl+C to stop)"
ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net | while IFS= read -r line; do
    echo "$line"
    
    # Look for the tunnel URL
    if [[ $line == *"Forwarding HTTP traffic from"* ]]; then
        TUNNEL_URL=$(echo $line | grep -o 'https://[^[:space:]]*')
        echo ""
        echo "✅ Tunnel URL: $TUNNEL_URL"
        echo ""
        echo "🔗 Use this URL in your React Native app:"
        echo "   1. Tap 'Server Config' in Remote Notifications section"
        echo "   2. Update Server URL to: $TUNNEL_URL"
        echo "   3. Use 'Send via Server' button"
        echo ""
        echo "📋 Test endpoints:"
        echo "   GET  $TUNNEL_URL/health"
        echo "   POST $TUNNEL_URL/send-notification"
        echo ""
    fi
done

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping server and tunnel..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
wait