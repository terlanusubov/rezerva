import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {styles} from './styles';
import {formatDate} from '../../utils/dateUtils';

interface DateTimePickerProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  isVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  date,
  onDateChange,
  isVisible,
  onOpen,
  onClose,
  mode = 'datetime',
  minimumDate,
}) => {
  const handleConfirm = (selectedDate: Date) => {
    onDateChange(selectedDate);
    onClose();
  };

  return (
    <View style={styles.dateTimeContainer}>
      <Text style={styles.dateRangeLabel}>{label}</Text>

      <TouchableOpacity style={styles.dateTimeButton} onPress={onOpen}>
        <Text style={styles.dateTimeButtonText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={date}
        onConfirm={handleConfirm}
        onCancel={onClose}
        minimumDate={minimumDate}
        minuteInterval={5}
      />
    </View>
  );
};

export default DateTimePicker;
