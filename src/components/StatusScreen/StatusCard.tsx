import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';

interface StatusCardProps {
  isOnline: boolean;
  offlineDuration: string;
  isLoading: boolean;
  showToggleButton: boolean;
  onToggleStatus: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  isOnline,
  offlineDuration,
  isLoading,
  showToggleButton,
  onToggleStatus,
}) => {
  // For debugging
  console.log('Platform.OS:', Platform.OS);
  console.log('Rendering StatusCard with isOnline:', isOnline);

  // iOS-specific component
  if (Platform.OS === 'ios') {
    return (
      <View style={iosStyles.card}>
        <View style={iosStyles.statusInfo}>
          <Text style={iosStyles.statusLabel}>Current Status</Text>
          <Text
            style={[
              iosStyles.statusValue,
              {color: isOnline ? '#059669' : '#dc2626'},
            ]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          {offlineDuration ? (
            <Text style={iosStyles.offlineDuration}>{offlineDuration}</Text>
          ) : null}
        </View>

        {showToggleButton && (
          <TouchableOpacity
            style={iosStyles.button}
            disabled={isLoading}
            onPress={onToggleStatus}>
            <LinearGradient
              colors={
                isOnline ? ['#34d399', '#059669'] : ['#fbbf24', '#d97706']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={iosStyles.gradient}>
              {isLoading ? (
                <View style={iosStyles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={iosStyles.buttonText}>Updating...</Text>
                </View>
              ) : (
                <Text style={iosStyles.buttonText}>
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Original Android version
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusInfo}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <Text
          style={[
            styles.statusValue,
            isOnline ? styles.statusValueOnline : styles.statusValueOffline,
          ]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        {offlineDuration ? (
          <Text style={styles.offlineDuration}>{offlineDuration}</Text>
        ) : null}
      </View>

      {showToggleButton && (
        <TouchableOpacity
          style={[
            styles.statusToggle,
            !isOnline && styles.statusToggleOffline,
            isLoading && styles.statusToggleDisabled,
          ]}
          disabled={isLoading}
          onPress={onToggleStatus}>
          <LinearGradient
            colors={isOnline ? ['#34d399', '#059669'] : ['#fbbf24', '#d97706']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.toggleGradient}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.toggleText}>Updating...</Text>
              </View>
            ) : (
              <Text style={styles.toggleText}>
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Dedicated iOS styles separate from the main styles file
const iosStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    height: 80, // Match Android height more closely
  },
  statusInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  offlineDuration: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  button: {
    width: 130,

    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default StatusCard;
