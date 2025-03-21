import axios from 'axios';
import {getToken} from '../utils/storage';
import {StatusRequestBody} from '../types/status';
import {Alert} from 'react-native';

const BASE_URL = 'http://192.168.88.34:5008/api/account/status';

export const updateStatus = async (
  makeOnline: boolean,
  makeOffline: boolean,
  startDate?: Date,
  endDate?: Date,
): Promise<boolean> => {
  try {
    // Format dates for API request
    const offlineFrom = startDate
      ? startDate.toISOString()
      : new Date().toISOString();

    // For "today" option, set end date to end of today
    const offlineTo = endDate
      ? endDate.toISOString()
      : (() => {
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          return endOfDay.toISOString();
        })();

    // Prepare request body
    const requestBody: StatusRequestBody = {
      makeOnline,
      makeOffline,
      offlineFrom,
      offlineTo,
    };

    console.log('Sending request:', JSON.stringify(requestBody, null, 2));

    // Make the API call
    const token = await getToken();
    const response = await axios.put(BASE_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.log('Error updating status:', error);
    Alert.alert(
      'Error',
      'Failed to update your status. Please try again later.',
    );
    return false;
  }
};
