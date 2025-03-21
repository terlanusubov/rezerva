import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {OfflineOption} from '../../types/status';
import {styles} from './styles';

interface OfflineOptionsProps {
  selectedOption: OfflineOption;
  isLoading: boolean;
  onSelectOption: (option: OfflineOption) => void;
}

const OfflineOptions: React.FC<OfflineOptionsProps> = ({
  selectedOption,
  isLoading,
  onSelectOption,
}) => {
  return (
    <View style={styles.offlineSettings}>
      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedOption === 'today' && styles.optionCardSelected,
          isLoading && styles.optionCardDisabled,
        ]}
        disabled={isLoading}
        onPress={() => onSelectOption('today')}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4f46e5" size="small" />
            <Text style={styles.optionText}>Setting status...</Text>
          </View>
        ) : (
          <Text style={styles.optionText}>For Today</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedOption === 'custom' && styles.optionCardSelected,
          isLoading && styles.optionCardDisabled,
        ]}
        disabled={isLoading}
        onPress={() => onSelectOption('custom')}>
        <Text style={styles.optionText}>Custom Date Range</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineOptions;
