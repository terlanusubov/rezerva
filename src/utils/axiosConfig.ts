import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reset } from '../navigation/navigationRef'; // Adjust the path as needed

const instance = axios.create({
  baseURL: 'http://192.168.88.34:5008/api',
  timeout: 10000,
});

instance.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token retrieved:', token);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle 401 errors
instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirecting to login');
      // Clear the token
      await AsyncStorage.removeItem('accessToken');

      // Reset navigation to Auth stack
      reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      });
    }
    return Promise.reject(error);
  }
);

export default instance;