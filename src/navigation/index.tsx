// src/navigation/index.ts
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { getToken } from '../utils/storage';
import MainAppNavigator from './MainAppNavigator';
import AuthNavigator from './AuthNavigator';
import StatusManagement from '../screens/StatusScreen';
import { navigationRef } from './navigationRef';

const Stack = createStackNavigator();

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
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