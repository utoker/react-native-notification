# Tunnel Mode Solutions for Remote Notifications

## 🚨 **ngrok Error ERR_NGROK_3004**

**Problem**: ngrok gateway error - "The server returned an invalid or incomplete HTTP response."

**Common Causes**:
- Server not running when ngrok tunnel starts
- Port conflicts
- ngrok service issues
- Firewall blocking connections

## 🛠️ **Alternative Solutions**

### **Solution 1: Fix ngrok Setup**

#### **Step 1: Ensure Server is Running First**
```bash
# Terminal 1 - Start server first
cd server
npm start

# Terminal 2 - Start ngrok (after server is running)
ngrok http 3000
```

#### **Step 2: Alternative ngrok Commands**
```bash
# Try with specific binding
ngrok http 3000 --bind-tls=true

# Try with different region
ngrok http 3000 --region=us

# Try with subdomain (if you have pro account)
ngrok http 3000 --subdomain=mynotifications
```

### **Solution 2: Use Alternative Tunneling Services**

#### **A. Cloudflare Tunnel (Free)**
```bash
# Install cloudflared
npm install -g cloudflared

# Start tunnel
cloudflared tunnel --url http://localhost:3000
```

#### **B. localtunnel (Free)**
```bash
# Install localtunnel
npm install -g localtunnel

# Start tunnel
lt --port 3000 --subdomain mynotifications
```

#### **C. serveo.net (Free, No Installation)**
```bash
# SSH tunnel
ssh -R 80:localhost:3000 serveo.net
```

### **Solution 3: Deploy to Cloud Service**

#### **A. Railway (Recommended - Free Tier)**
1. Create account at railway.app
2. Connect GitHub repo
3. Deploy server automatically
4. Get permanent URL

#### **B. Render (Free Tier)**
1. Create account at render.com  
2. Connect GitHub repo
3. Deploy as Web Service
4. Get permanent URL

#### **C. Vercel (Free)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from server directory
cd server
vercel

# Get permanent URL
```

### **Solution 4: Use Expo Development Server Proxy**

Update the app to use Expo's development server as a proxy:

```javascript
// In App.js, detect tunnel mode and adjust server URL
const getServerUrl = () => {
  const expoUrl = Constants.expoConfig?.hostUri;
  if (expoUrl) {
    // Extract the tunnel URL and use it as base
    const baseUrl = `https://${expoUrl.split(':')[0]}.tunnel.dev`;
    return `${baseUrl}:3000`;
  }
  return serverUrl;
};
```

### **Solution 5: Test with Public APIs**

For immediate testing, use external notification services:

#### **A. Expo Push Tool (Web Interface)**
1. Visit: https://expo.dev/notifications
2. Enter your push token from the app
3. Send test notifications directly

#### **B. Postman/curl to Expo API**
```bash
curl -H "Content-Type: application/json" \
     -X POST "https://exp.host/--/api/v2/push/send" \
     -d '{
       "to": "YOUR_PUSH_TOKEN_HERE",
       "title": "Remote Test",
       "body": "Sent via direct API call"
     }'
```

## 🔧 **Quick Fix Steps**

### **Immediate Solution (5 minutes):**

1. **Use localtunnel instead of ngrok:**
```bash
# Install localtunnel
npm install -g localtunnel

# Start server (Terminal 1)
cd server && npm start

# Start tunnel (Terminal 2)  
lt --port 3000
```

2. **Update app server URL:**
   - Copy the localtunnel URL (e.g., https://abc123.loca.lt)
   - In the app: Tap "Server Config"
   - Paste the localtunnel URL
   - Test "Send via Server"

### **Permanent Solution (Railway Deployment):**

1. **Create Railway account**: https://railway.app
2. **Connect GitHub repo** with your notification server
3. **Deploy automatically** - Railway detects Node.js
4. **Get permanent URL** (e.g., https://yourapp.railway.app)
5. **Update app config** with permanent URL

## 🎯 **Testing Priority Order**

1. ✅ **localtunnel** (quickest alternative to ngrok)
2. ✅ **Expo Push Tool** (no server needed)
3. ✅ **Railway deployment** (permanent solution)
4. ✅ **Direct API calls** (test without server)

## 📝 **Updated Scripts**

I'll create updated scripts that use multiple tunnel options:

### **server/start-with-tunnel.sh** (Multi-option)
```bash
#!/bin/bash
echo "🚀 Starting server with tunnel options..."

# Start server
node server.js &
SERVER_PID=$!
sleep 2

echo "Choose tunnel option:"
echo "1. ngrok (if working)"
echo "2. localtunnel" 
echo "3. cloudflare tunnel"
read -p "Enter choice (1-3): " choice

case $choice in
  1) ngrok http 3000;;
  2) lt --port 3000;;
  3) cloudflared tunnel --url http://localhost:3000;;
esac
```

## ✅ **Recommended Immediate Action**

**Try localtunnel right now:**
```bash
npm install -g localtunnel
cd server && npm start &
lt --port 3000
```

Then update your app's server URL with the localtunnel URL and test remote notifications!