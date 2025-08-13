# 🚀 Quick Fix for ngrok ERR_NGROK_3004

## **Option 1: Use localtunnel (Recommended)**

### **Step 1: Start Server + Tunnel**
```bash
# Option A: Use the automated script
cd server
./start-with-localtunnel.sh

# Option B: Manual steps
cd server
npm start &
lt --port 3000
```

### **Step 2: Update App Configuration**
1. Copy the tunnel URL from terminal (e.g., `https://abc123.loca.lt`)
2. In React Native app: Tap **"Server Config ▶"**
3. Paste the localtunnel URL
4. Tap **"Send via Server"** to test

---

## **Option 2: Use Expo Push Tool (No Server Needed)**

### **Immediate Testing:**
1. In your app, copy the **Push Token** (tap to copy)
2. Visit: **https://expo.dev/notifications**
3. Paste your token
4. Send test notification

---

## **Option 3: Direct API Call (Test Without Server)**

```bash
# Replace YOUR_PUSH_TOKEN with your actual token
curl -H "Content-Type: application/json" \
     -X POST "https://exp.host/--/api/v2/push/send" \
     -d '{
       "to": "YOUR_PUSH_TOKEN_HERE",
       "title": "Direct API Test",
       "body": "This bypasses your local server completely"
     }'
```

---

## **Why ngrok Failed:**
- `ERR_NGROK_3004` = Server response issues
- Often caused by server not running when tunnel starts
- Port conflicts or firewall blocking

## **localtunnel Advantages:**
- ✅ More reliable than ngrok for development
- ✅ No account required
- ✅ Handles server startup better
- ✅ Free unlimited usage

---

## **Test Priority:**
1. **localtunnel** (2 minutes to set up)
2. **Expo Push Tool** (30 seconds, no setup)
3. **Direct API** (immediate testing)

Try **localtunnel first** - it should solve your tunnel mode remote notification issue!