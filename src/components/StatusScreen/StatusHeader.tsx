import React from 'react';
import {Text, TouchableOpacity, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StatusManagementScreenNavigationProp} from '../../types/status';
import {styles} from './styles';

interface StatusHeaderProps {
  navigation: StatusManagementScreenNavigationProp;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#281A4B', '#4F46E5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Status Management</Text>
      </LinearGradient>
    </>
  );
};

export default StatusHeader;
