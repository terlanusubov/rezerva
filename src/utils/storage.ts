import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const setToken = (token: string) => {
  storage.set('authToken', token);

  console.log('Token set:', token);
};

export const getToken = () => {
  return storage.getString('authToken') || null;
};

export const removeToken = () => {
  storage.delete('authToken');
};
