// src/navigation/index.ts
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getToken } from '../utils/storage';
import MainAppNavigator from './MainAppNavigator';
import AuthNavigator from './AuthNavigator';
import StatusManagement from '../screens/StatusScreen';
import { navigationRef } from './navigationRef';

const Stack = createStackNavigator();

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState < boolean | null > (null);
  console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Check for token on mount
    const checkAuth = async () => {
      try {
        // Check both storage mechanisms to be sure
        const asyncToken = await AsyncStorage.getItem('accessToken');
        const utilToken = getToken();

        const hasToken = !!asyncToken || !!utilToken;
        console.log('Token check:', { asyncToken: !!asyncToken, utilToken: !!utilToken });

        setIsAuthenticated(hasToken);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const authStateListener = async () => {
      // Create a listener for AsyncStorage changes
      // This is a limited solution since AsyncStorage doesn't have built-in listeners
      // For a more robust solution, consider using a state management library like Redux
    };

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Setup a custom event listener for auth changes
  useEffect(() => {
    const handleStorageChange = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };

    // This is a workaround since React Native doesn't have storage event listeners
    // You would normally use a state management solution (Redux, Context) for this

    // For now, we'll just expose a function globally that your login screen can call
    if (global) {
      // @ts-ignore
      global.updateAuthState = handleStorageChange;
    }

    return () => {
      if (global) {
        // @ts-ignore
        global.updateAuthState = undefined;
      }
    };
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainApp" component={MainAppNavigator} />
            <Stack.Screen name="Status" component={StatusManagement} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;