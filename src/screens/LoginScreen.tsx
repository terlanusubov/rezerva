import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import instance from '../utils/axiosConfig'; // Use the configured axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '../utils/storage';

interface FormState {
  phone: string;
  password: string;
}

interface ErrorsState {
  phone?: string;
  password?: string;
}

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [form, setForm] = useState<FormState>({ phone: '', password: '' });
  const [errors, setErrors] = useState<ErrorsState>({});
  const [loading, setLoading] = useState(false);
  const windowHeight = Dimensions.get('screen').height;

  const BASE_URL = 'http://192.168.88.34:5008/api';
  const API_URL = `${BASE_URL}/account/login`;
  const TOKEN_URL = `${BASE_URL}/account/tokens`;

  console.log('API URL:', TOKEN_URL);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field: keyof FormState, value: string) => {
    let errorMsg = '';
    if (!value.trim()) {
      errorMsg = 'This field is required';
    } else if (field === 'phone' && !/^[0-9]+$/.test(value)) {
      errorMsg = 'Phone number must contain only digits';
    } else if (field === 'password' && value.length < 6) {
      errorMsg = 'Password must be at least 6 characters';
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const isValidForm = () =>
    Object.values(form).every(val => val.trim()) &&
    !Object.values(errors).some(err => err);

  // Update your handleSubmit function with these changes
  const handleSubmit = async () => {
    if (!isValidForm()) {
      Alert.alert('Error', 'Please fill out all fields correctly.');
      return;
    }

    setLoading(true);

    try {
      const response = await instance.post(API_URL, {
        phoneNumber: form.phone,
        password: form.password,
      });

      console.log('API Response:', response.data);

      if (response.data.response && response.data.response.token) {
        const tokenApi = response.data.response.token;

        // Store the token
        await AsyncStorage.setItem('accessToken', tokenApi);
        setToken(tokenApi);

        console.log('==== DEBUG INFO ====');
        console.log('Token stored:', tokenApi);
        const verifyToken = await AsyncStorage.getItem('accessToken');
        console.log('Token verification:', verifyToken);
        console.log('==== END DEBUG ====');

        // Send FCM token later - skip this for now to simplify debugging

        // IMPORTANT: Remove the Alert and navigate directly
        navigation.navigate('MainApp'); // Try this simple approach first

        // If navigate doesn't work, try this alternative:
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'MainApp' }]
        // });
      } else {
        Alert.alert('Error', 'No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);

      // More detailed error logging
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', JSON.stringify(error.response.data));
      }

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            flex: 1,
            backgroundColor: '#6366f1',
            paddingTop: windowHeight / 11,
          }}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Enter your credentials</Text>
          </View>
          <View style={styles.formContainer}>
            {(['phone', 'password'] as (keyof FormState)[]).map(
              (field, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <Text style={styles.label}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                  <TextInput
                    style={[styles.input, errors[field] && styles.inputError]}
                    placeholder={`Enter your ${field}`}
                    value={form[field]}
                    onChangeText={text => handleChange(field, text)}
                    keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                    secureTextEntry={field === 'password'}
                  />
                  {errors[field] && (
                    <Text style={styles.errorText}>{errors[field]}</Text>
                  )}
                </View>
              ),
            )}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={[styles.button, !isValidForm() && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={!isValidForm() || loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { flex: 1 },
  header: { alignItems: 'center', flex: 1, backgroundColor: '#6366f1' },
  title: { color: 'white', fontSize: 24, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16 },
  formContainer: {
    flex: 3,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    backgroundColor: 'white',
  },
  inputWrapper: { marginBottom: 20 },
  label: { color: '#4b5563', fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  disabledButton: { backgroundColor: '#e5e7eb' },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
});

export default LoginScreen;
