// src/navigation/navigationRef.ts
import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.log('Navigation not ready, could not navigate to:', name);
  }
}

export function reset(state: any) {
  if (navigationRef.current) {
    navigationRef.current.reset(state);
  }
}