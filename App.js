import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  Alert, 
  Platform, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  AppState
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { 
  requestPermissions, 
  getPushToken, 
  scheduleNotificationJS,
  cancelAllJSScheduledNotifications
} from './services/NotificationService';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('Test Notification');
  const [notificationBody, setNotificationBody] = useState('This is a test notification!');
  const [delaySeconds, setDelaySeconds] = useState('5');
  const [serverUrl, setServerUrl] = useState('http://localhost:3000');
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotifications();

    // App state change listener
    const handleAppStateChange = (nextAppState) => {
      console.log(`📱 App state changed: ${appState} → ${nextAppState}`);
      setAppState(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 NOTIFICATION RECEIVED:');
      console.log('   Title:', notification.request.content.title);
      console.log('   Body:', notification.request.content.body);
      console.log('   Data:', notification.request.content.data);
      console.log('   Received at:', new Date().toISOString());
      console.log(`   App state: ${AppState.currentState}`);
      
      // Check if this was a scheduled notification
      if (notification.request.content.data?.scheduledAt) {
        const scheduledAt = notification.request.content.data.scheduledAt;
        const actualDelay = Date.now() - scheduledAt;
        const expectedDelay = notification.request.content.data.delaySeconds * 1000;
        console.log(`⏱️  Expected delay: ${expectedDelay}ms`);
        console.log(`⏰ Actual delay: ${actualDelay}ms`);
        console.log(`📊 Timing accuracy: ${actualDelay - expectedDelay}ms difference`);
        
        if (actualDelay < 2000) {
          console.log('⚠️  WARNING: Notification appeared too quickly! Expected delay not respected.');
        }
      }
      
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification response (user tapped):', response.notification.request.content.title);
      console.log('   Action:', response.actionIdentifier);
      console.log('   Data:', response.notification.request.content.data);
      console.log(`   App state: ${AppState.currentState}`);
    });

    return () => {
      appStateSubscription?.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [appState]);

  const setupNotifications = async () => {
    const hasPermission = await requestPermissions();
    setPermissionGranted(hasPermission);
    
    if (hasPermission) {
      const token = await getPushToken();
      setExpoPushToken(token || 'Setup required - see README.md');
    }
  };


  const handleScheduleNotificationJS = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Please grant notification permissions first.');
      return;
    }

    const seconds = parseInt(delaySeconds) || 5;
    
    try {
      console.log(`📅 Scheduling notification: ${notificationTitle} in ${seconds} seconds`);
      
      const scheduleId = await scheduleNotificationJS(notificationTitle, notificationBody, seconds);
      
      Alert.alert(
        'Notification Scheduled', 
        `Your notification will appear in ${seconds} seconds.`
      );
      
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('Error', `Failed to schedule notification: ${error.message}`);
    }
  };

  const handleImmediateNotification = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Please grant notification permissions first.');
      return;
    }

    try {
      await scheduleNotificationJS(notificationTitle, notificationBody, 1);
      Alert.alert('Notification Scheduled', 'Notification will appear in 1 second');
    } catch (error) {
      console.error('Failed to schedule immediate notification:', error);
      Alert.alert('Error', `Failed to schedule notification: ${error.message}`);
    }
  };

  const handleCancelNotifications = async () => {
    await cancelAllJSScheduledNotifications();
    Alert.alert('Success', 'All scheduled notifications have been cancelled');
  };

  const handleSendRemoteNotification = async () => {
    if (!expoPushToken || expoPushToken === 'Setup required - see README.md') {
      Alert.alert('Error', 'Push token not available. Make sure you have a valid push token.');
      return;
    }

    const endpoint = `${serverUrl}/send-notification`;
    console.log(`🌐 Sending remote notification to: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: expoPushToken,
          title: notificationTitle,
          body: notificationBody,
          data: { source: 'remote', timestamp: Date.now(), serverUrl }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Remote notification sent successfully!');
        console.log('✅ Remote notification result:', result);
      } else {
        Alert.alert('Error', result.error || 'Failed to send remote notification');
        console.error('❌ Remote notification error:', result);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to connect to server at ${serverUrl}.\n\nMake sure the server is running and accessible.`);
      console.error('❌ Remote notification error:', error);
    }
  };

  const copyTokenToClipboard = async () => {
    if (expoPushToken && expoPushToken !== 'Setup required - see README.md') {
      // In a real app, you would use Expo.Clipboard or @react-native-clipboard/clipboard
      Alert.alert('Push Token', `Token: ${expoPushToken}\n\nCopy this token to test with external services.`);
    }
  };


  const handleRequestPermissions = async () => {
    try {
      console.log('🔒 Requesting notification permissions...');
      // Force a new permission request
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
          provisional: false
        },
        android: {},
      });
      
      console.log('📋 Permission status:', status);
      const hasPermission = status === 'granted';
      setPermissionGranted(hasPermission);
      
      if (hasPermission) {
        console.log('🔑 Getting push token...');
        const token = await getPushToken();
        if (token) {
          setExpoPushToken(token);
          Alert.alert('Success', 'Notification permissions granted!');
        } else {
          Alert.alert('Error', 'Failed to get push token. Please check your configuration.');
        }
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings to receive updates.');
      }
    } catch (error) {
      console.error('❌ Error in handleRequestPermissions:', error);
      setPermissionGranted(false);
      Alert.alert(
        'Permission Error',
        'Failed to request notification permissions. Please try again.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Push Notifications Demo</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permission Status</Text>
          <Text style={styles.status}>
            {permissionGranted ? '✅ Granted' : '❌ Not Granted'}
          </Text>
          {!permissionGranted && (
            <TouchableOpacity style={styles.button} onPress={handleRequestPermissions}>
              <Text style={styles.buttonText}>Request Permissions</Text>
            </TouchableOpacity>
          )}
        </View>

        {expoPushToken && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push Token</Text>
            <TouchableOpacity onPress={copyTokenToClipboard}>
              <Text style={styles.tokenText} numberOfLines={4}>
                {expoPushToken}
              </Text>
            </TouchableOpacity>
            {expoPushToken === 'Setup required - see README.md' ? (
              <Text style={styles.setupNote}>
                Run "npx expo login" and "npx eas init" to generate a real push token
              </Text>
            ) : (
              <Text style={styles.setupNote}>
                Tap token to copy • Use with server or Expo Push Tool
              </Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Notifications</Text>
          
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={notificationTitle}
            onChangeText={setNotificationTitle}
            placeholder="Enter notification title"
          />
          
          <Text style={styles.label}>Body:</Text>
          <TextInput
            style={styles.input}
            value={notificationBody}
            onChangeText={setNotificationBody}
            placeholder="Enter notification body"
            multiline
          />
          
          <Text style={styles.label}>Delay (seconds):</Text>
          <TextInput
            style={styles.input}
            value={delaySeconds}
            onChangeText={setDelaySeconds}
            placeholder="5"
            keyboardType="numeric"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleScheduleNotificationJS}>
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={handleImmediateNotification}>
              <Text style={styles.buttonText}>Send Now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelNotifications}>
            <Text style={styles.buttonText}>Cancel All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remote Notifications</Text>
          <Text style={styles.description}>
            Send notifications from a server using your push token
          </Text>

          <View style={styles.serverConfigContainer}>
            <TouchableOpacity 
              style={styles.configToggle} 
              onPress={() => setShowServerConfig(!showServerConfig)}
            >
              <Text style={styles.configToggleText}>
                Server Config {showServerConfig ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {showServerConfig && (
              <View style={styles.configPanel}>
                <Text style={styles.label}>Server URL:</Text>
                <TextInput
                  style={styles.input}
                  value={serverUrl}
                  onChangeText={setServerUrl}
                  placeholder="Enter server URL (e.g., https://abc123.ngrok.io)"
                />
                <View style={styles.presetButtons}>
                  <TouchableOpacity 
                    style={styles.presetButton} 
                    onPress={() => setServerUrl('http://localhost:3000')}
                  >
                    <Text style={styles.presetButtonText}>Local</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.presetButton} 
                    onPress={() => setServerUrl('https://your-ngrok-url.ngrok.io')}
                  >
                    <Text style={styles.presetButtonText}>ngrok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          
          <TouchableOpacity style={[styles.button, styles.remoteButton]} onPress={handleSendRemoteNotification}>
            <Text style={styles.buttonText}>Send via Server</Text>
          </TouchableOpacity>

          <Text style={styles.serverNote}>
            Current server: {serverUrl}
          </Text>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkTitle}>Test with Expo Push Tool:</Text>
            <Text style={styles.linkText}>
              Visit: https://expo.dev/notifications
            </Text>
            <Text style={styles.linkSubtext}>
              Use your push token above to send test notifications
            </Text>
          </View>
        </View>

        {notification && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Received Notification</Text>
            <Text style={styles.notificationText}>
              Title: {notification.request.content.title}
            </Text>
            <Text style={styles.notificationText}>
              Body: {notification.request.content.body}
            </Text>
          </View>
        )}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  tokenText: {
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  setupNote: {
    fontSize: 12,
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  remoteButton: {
    backgroundColor: '#34C759',
  },
  serverNote: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  linkContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  linkSubtext: {
    fontSize: 11,
    color: '#666',
  },
  serverConfigContainer: {
    marginBottom: 15,
  },
  configToggle: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  configToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  configPanel: {
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  presetButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  presetButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
  },
  presetButtonText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});
