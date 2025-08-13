#!/bin/bash

echo "🧪 Testing Direct Expo Push API (No Tunnels Required)"
echo "===================================================="
echo ""

# Get push token from user
echo "📱 Please copy your push token from the React Native app"
echo "   (The long string that starts with 'ExponentPushToken[' or 'ExpoPushToken[')"
echo ""
read -p "🔑 Paste your push token here: " PUSH_TOKEN

if [[ -z "$PUSH_TOKEN" ]]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo ""
echo "📡 Sending test notification directly to Expo API..."
echo "⏳ This should appear on your device in a few seconds..."
echo ""

# Send notification directly to Expo API
curl -H "Content-Type: application/json" \
     -X POST "https://exp.host/--/api/v2/push/send" \
     -d "{
       \"to\": \"$PUSH_TOKEN\",
       \"title\": \"🎉 Direct API Success!\",
       \"body\": \"This notification bypassed all tunnel issues and came directly from Expo API!\",
       \"data\": {
         \"source\": \"direct_api_test\",
         \"timestamp\": \"$(date -Iseconds)\"
       }
     }"

echo ""
echo ""
echo "✅ API call completed!"
echo ""
echo "📱 Check your device - you should see the notification!"
echo ""
echo "💡 If it worked, this proves:"
echo "   ✓ Your push token is valid"
echo "   ✓ Remote notifications work perfectly"  
echo "   ✓ The issue is just with tunnel services, not notifications"
echo ""
echo "🚀 Next steps:"
echo "   1. Try the Expo web tool: https://expo.dev/notifications"
echo "   2. Deploy server to Railway/Render for permanent solution"
echo "   3. Use phone hotspot to bypass WiFi restrictions"