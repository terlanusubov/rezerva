import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from './DateTimePicker';
import {styles} from './styles';

interface CustomDateRangeProps {
  startDate: Date;
  endDate: Date;
  isLoading: boolean;
  isStartDatePickerVisible: boolean;
  isEndDatePickerVisible: boolean;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onShowStartDatePicker: () => void;
  onHideStartDatePicker: () => void;
  onShowEndDatePicker: () => void;
  onHideEndDatePicker: () => void;
  onSave: () => void;
}

const CustomDateRange: React.FC<CustomDateRangeProps> = ({
  startDate,
  endDate,
  isLoading,
  isStartDatePickerVisible,
  isEndDatePickerVisible,
  onStartDateChange,
  onEndDateChange,
  onShowStartDatePicker,
  onHideStartDatePicker,
  onShowEndDatePicker,
  onHideEndDatePicker,
  onSave,
}) => {
  return (
    <View style={styles.dateRange}>
      <DateTimePicker
        label="Start Date & Time"
        date={startDate}
        onDateChange={onStartDateChange}
        isVisible={isStartDatePickerVisible}
        onOpen={onShowStartDatePicker}
        onClose={onHideStartDatePicker}
      />

      <DateTimePicker
        label="End Date & Time"
        date={endDate}
        onDateChange={onEndDateChange}
        isVisible={isEndDatePickerVisible}
        onOpen={onShowEndDatePicker}
        onClose={onHideEndDatePicker}
        minimumDate={startDate} // Prevent selecting a date before start date
      />

      <Text style={styles.dateFormatHelper}>
        Tap the date and time fields above to open the date picker
      </Text>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        disabled={isLoading}
        onPress={onSave}>
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.saveGradient}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.saveText}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDateRange;
