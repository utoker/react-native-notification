import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('🔔 Notification handler called:', notification.request.content.title);
    console.log('📅 Notification data:', notification.request.content.data);
    console.log('⏰ Received at:', new Date().toISOString());
    
    // Check if this is a scheduled notification that should be shown normally
    const isScheduled = notification.request.content.data?.source === 'local_scheduled';
    
    if (isScheduled) {
      console.log('📋 Handling scheduled notification');
      return {
        shouldShowBanner: true,  // Replace deprecated shouldShowAlert
        shouldShowList: true,    // Show in notification list
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }
    
    // For other notifications (remote, etc.)
    console.log('🌐 Handling remote/other notification');
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export const requestPermissions = async () => {
  try {
    console.log('📱 Checking device compatibility...');
    if (!Device.isDevice) {
      console.warn('❌ Not a physical device');
      throw new Error('Push notifications are only supported on physical devices');
    }

    // Force the permission dialog to show by directly requesting permissions
    console.log('🔔 Requesting notification permissions...');
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
        provisional: false
      },
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
      android: {}, // Android permissions are handled through the notification channel
    });
    
    const finalStatus = status;
    console.log('📋 New permission status:', status);
    
    if (finalStatus !== 'granted') {
      console.warn('❌ Permission not granted:', finalStatus);
      throw new Error('Permission not granted for push notifications');
    }
    
    if (Platform.OS === 'android') {
      console.log('🤖 Setting up Android notification channel...');
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          enableLights: true,
        });
        console.log('✅ Android channel setup complete');
      } catch (error) {
        console.error('⚠️ Error setting up Android channel:', error);
        // Don't throw here, as notifications might still work
      }
    }
    
    console.log('✅ Notification permissions granted successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in requestPermissions:', error);
    throw error; // Let the calling function handle the error
  }
};

export const getPushToken = async () => {
  try {
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: '1168fc6b-4a4a-43b5-aab2-85a3f39898fb'
    })).data;
    console.log('Expo Push Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};




// JavaScript-based scheduling fallback using setTimeout
const activeTimeouts = new Map();

export const scheduleNotificationJS = async (title, body, seconds = 2) => {
  try {
    console.log(`🟡 JS-based scheduling: ${title} in ${seconds} seconds`);
    console.log(`⏰ Current time: ${new Date().toISOString()}`);
    
    const delaySeconds = Math.max(1, Math.min(Math.floor(seconds), 3600));
    const deliveryTime = Date.now() + (delaySeconds * 1000);
    const scheduleId = `js_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🎯 Expected delivery: ${new Date(deliveryTime).toISOString()}`);
    console.log(`📋 JS Schedule ID: ${scheduleId}`);
    
    // Create a timeout to fire the notification
    const timeoutId = setTimeout(async () => {
      try {
        console.log(`⏰ JS timeout fired for: ${title}`);
        console.log(`📊 Delivered at: ${new Date().toISOString()}`);
        
        // Send immediate notification
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${title} (JS Scheduled)`,
            body: body,
            data: { 
              scheduledAt: Date.now() - (delaySeconds * 1000),
              expectedDelivery: deliveryTime,
              delaySeconds: delaySeconds,
              source: 'js_scheduled',
              scheduleId: scheduleId
            },
          },
          trigger: null, // Immediate delivery
        });
        
        activeTimeouts.delete(scheduleId);
        console.log(`✅ JS-scheduled notification delivered with ID: ${notificationId}`);
        
      } catch (error) {
        console.error('❌ Error firing JS-scheduled notification:', error);
        activeTimeouts.delete(scheduleId);
      }
    }, delaySeconds * 1000);
    
    activeTimeouts.set(scheduleId, {
      timeoutId,
      title,
      body,
      scheduledAt: Date.now(),
      deliveryTime,
      delaySeconds
    });
    
    console.log(`✅ JS notification scheduled successfully with ID: ${scheduleId}`);
    return scheduleId;
    
  } catch (error) {
    console.error('❌ Error with JS-based scheduling:', error);
    throw error;
  }
};

export const cancelAllJSScheduledNotifications = async () => {
  try {
    console.log(`🗑️  Canceling ${activeTimeouts.size} JS-scheduled notifications...`);
    
    activeTimeouts.forEach((notification, scheduleId) => {
      clearTimeout(notification.timeoutId);
      console.log(`   Cancelled: ${notification.title} (${scheduleId})`);
    });
    
    activeTimeouts.clear();
    console.log('✅ All JS-scheduled notifications cancelled');
  } catch (error) {
    console.error('❌ Error canceling JS notifications:', error);
  }
};


