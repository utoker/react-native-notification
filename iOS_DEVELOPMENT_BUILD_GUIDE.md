# iOS Development Build Guide for Notification Testing

## 🎯 **Goal**
Create an iOS development build to test native notification scheduling (fix the instant notification issue that occurs in Expo Go).

## 📋 **Prerequisites**

### **Required:**
1. **iOS Device** ✅ (You have this)
2. **Apple Developer Account** (Free or Paid)
3. **macOS** (for iOS development) or **EAS Build Service**
4. **Device UDID** (we'll get this)

### **Apple Developer Account Options:**

#### **Option A: Free Apple Developer Account (Recommended)**
- ✅ **Cost:** Free
- ✅ **Can create development builds**
- ✅ **Perfect for testing notifications**
- ❌ **Limited to 7 days installation**
- ❌ **Need to rebuild weekly**

#### **Option B: Paid Apple Developer Account ($99/year)**
- ✅ **Cost:** $99/year
- ✅ **Longer app installation periods**
- ✅ **TestFlight distribution**
- ✅ **App Store distribution**

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Apple Developer Account**
1. Visit: https://developer.apple.com
2. Sign up with your Apple ID (free account works)
3. Agree to developer terms

### **Step 2: Get Your Device UDID**
**Method A: Using Settings App**
1. iOS Settings → General → About
2. Tap on "Name" to reveal UDID
3. Copy the UDID (long string of characters)

**Method B: Using Finder/iTunes (macOS)**
1. Connect iPhone to Mac
2. Open Finder → Select iPhone
3. Click on device info to cycle through and find UDID

**Method C: Using EAS CLI (Easiest)**
```bash
eas device:create
```

### **Step 3: Build iOS Development App**

#### **Option A: EAS Build (Recommended - No macOS Required)**
```bash
# Make sure you're logged in
eas login

# Register your iOS device
eas device:create

# Create the iOS development build
eas build --platform ios --profile development-device

# Follow the prompts to:
# - Log into Apple Developer account
# - Register device UDID
# - Create development certificate
# - Build the app
```

#### **Option B: Local Build (Requires macOS)**
```bash
# Create development build locally
eas build --platform ios --profile development-device --local
```

### **Step 4: Install on Device**
1. **Download the `.ipa` file** from EAS Build dashboard
2. **Install using TestFlight** (if you have paid account) or
3. **Install using Apple Configurator** (free method) or
4. **Install using Xcode** (drag .ipa to Xcode Devices window)

## 🧪 **Testing Native Notifications**

### **What to Test:**
1. **Native Scheduling**: Use "Schedule" button (10-20 second delays)
2. **Background Behavior**: Use "Schedule & Background" button
3. **JavaScript Timer**: Compare with "Schedule (JS Timer)" button
4. **Timing Accuracy**: Monitor console logs for actual vs expected delays

### **Expected Results in iOS Development Build:**
- ✅ **10+ second delays should be respected** (not instant)
- ✅ **Background notifications should work properly**
- ✅ **Scheduled notifications queue should persist**
- ✅ **iOS native notification timing should be accurate**

### **Test Commands:**
```bash
# After installing development build
# Test native scheduling vs Expo Go:

# In Development Build (Expected: ✅ Works properly)
# - Set delay to 20 seconds
# - Tap "Schedule" button
# - Notification should appear in exactly 20 seconds

# Compare with Expo Go (Current: ❌ Appears instantly)
# - Same 20 second test
# - Notification appears immediately (23ms delay)
```

## 📊 **Comparison: Expo Go vs Development Build**

| Feature | Expo Go | iOS Development Build |
|---------|---------|----------------------|
| Remote Notifications | ✅ Works | ✅ Works |
| Push Tokens | ✅ Works | ✅ Works |
| **Scheduled Notifications** | ❌ **Instant delivery** | ✅ **Expected: Proper timing** |
| Background Notifications | ❓ Limited | ✅ Full support |
| Native iOS Features | ❓ Emulated | ✅ Native |

## 🔧 **Build Commands**

### **For Your Setup:**
```bash
# 1. Login to EAS
eas login

# 2. Register iOS device (interactive)
eas device:create

# 3. Create iOS development build
eas build --platform ios --profile development-device

# 4. Monitor build progress
eas build:list

# 5. Install on device when ready
```

### **Alternative: Quick Test Build**
```bash
# If you want to test locally first
eas build --platform ios --profile development --local
```

## 🎯 **Success Criteria**

### **Build Success:**
- ✅ iOS development build creates successfully
- ✅ App installs on your iOS device
- ✅ App runs without crashes
- ✅ Push token generates correctly

### **Notification Success:**
- ✅ **Native scheduling respects timing** (10+ second delays work)
- ✅ **Background notifications work properly**
- ✅ **Scheduled notification queue persists**
- ✅ **No more instant delivery issues**

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Apple Developer login fails**: Ensure 2FA is set up
2. **Device not registered**: Run `eas device:create` again
3. **Certificate issues**: Let EAS manage certificates automatically
4. **Build fails**: Check bundle identifier conflicts

### **Alternative if Build Issues:**
1. **Continue using JavaScript Timer** (already works perfectly)
2. **Deploy to TestFlight** for production-like testing
3. **Use Simulator** for basic testing (limited notification support)

## 📱 **Next Steps After Build**

1. **Install development build on iOS device**
2. **Test notification scheduling with 10-20 second delays**
3. **Compare timing accuracy vs Expo Go**
4. **Document which methods work in production build**
5. **Create production deployment strategy**

The iOS development build should resolve the notification timing issues and provide proper native iOS notification scheduling behavior!