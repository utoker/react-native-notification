#!/bin/bash

echo "🚀 Starting Expo Push Notification Server with localtunnel..."
echo "============================================================="

# Check if localtunnel is installed
if ! command -v lt &> /dev/null; then
    echo "📦 Installing localtunnel..."
    npm install -g localtunnel
fi

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

# Start localtunnel
echo "🌐 Starting localtunnel..."
echo ""
echo "⚠️  IMPORTANT: When localtunnel starts, it may show a warning page"
echo "   Click 'Continue' on the warning page to access your server"
echo ""

# Start localtunnel with random subdomain
lt --port 3000 | while IFS= read -r line; do
    echo "$line"
    
    # Extract URL if found
    if [[ $line == *"your url is: "* ]]; then
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
        echo "💡 If you see a warning page, click 'Continue' to proceed"
        echo ""
    fi
done

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping server and tunnel..."
    kill $SERVER_PID 2>/dev/null
    pkill -f "lt --port 3000" 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
wait