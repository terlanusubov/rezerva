import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const sendTokenToBackend = async (token: string) => {
  try {
    const userToken = await AsyncStorage.getItem('accessToken'); // JWT Token
    if (!userToken) {
      return; // If the user is not logged in, no need to send
    }

    await axios.post(
      'http://192.168.88.34:5008/api/account/tokens',
      {token},
      {headers: {Authorization: `Bearer ${userToken}`}},
    );

    console.log('FCM Token Sent to Backend:', token);
  } catch (error) {
    console.error('Error sending FCM token to backend:', error);
  }
};

const requestFCMPermissionAndGetToken = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem('fcmToken', token);
      sendTokenToBackend(token);
    }
  }
};

const useFCMToken = () => {
  useEffect(() => {
    requestFCMPermissionAndGetToken();

    // Send the new token to the backend when it changes
    const unsubscribe = messaging().onTokenRefresh(async newToken => {
      await AsyncStorage.setItem('fcmToken', newToken);
      sendTokenToBackend(newToken);
      console.log('FCM Token Refreshed:', newToken);
    });

    return unsubscribe;
  }, []);
};

export default useFCMToken;
