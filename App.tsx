import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import Router from './src/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import {logEvent} from '@react-native-firebase/analytics';
import useFCMToken from './src/hooks/useFCMToken';
import {analytics} from './src/firebase/config';

export default function App() {
  useFCMToken();

  useEffect(() => {
    const init = async () => {
      await messaging().registerDeviceForRemoteMessages();
      await requestUserPermission();
      await getDeviceToken();
      handleForegroundNotifications();
      logEvent(analytics(), 'app_open');
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });

    // Handle background and quit state notifications
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  // Request Notification Permission
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  async function getDeviceToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Device Token:', token);
    } catch (error) {
      console.error('Error getting device token:', error);
    }
  }

  function handleForegroundNotifications() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || '',
      );
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Router />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});
