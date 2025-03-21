import {StackNavigationProp} from '@react-navigation/stack';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  StatusManagement: undefined;
};

export type StatusManagementScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StatusManagement'
>;

export interface StatusManagementProps {
  navigation: StatusManagementScreenNavigationProp;
}

// Status types
export type OfflineOption = 'today' | 'custom' | null;

export interface OfflineSettings {
  startDate: string;
  endDate: string;
  durationType: 'today' | 'custom';
}

export interface StatusRequestBody {
  makeOnline: boolean;
  makeOffline: boolean;
  offlineFrom: string;
  offlineTo: string;
}

// For global type definition of Android bridge
declare global {
  namespace NodeJS {
    interface Global {
      Android?: {
        onStatusSaved: (data: string) => void;
      };
    }
  }
}
