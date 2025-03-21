import React from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal} from 'react-native';
import {styles} from './styles';

interface DateTimeModalProps {
  visible: boolean;
  mode: 'start' | 'end';
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onDayChange: (value: string) => void;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const DateTimeModal: React.FC<DateTimeModalProps> = ({
  visible,
  mode,
  year,
  month,
  day,
  hour,
  minute,
  onYearChange,
  onMonthChange,
  onDayChange,
  onHourChange,
  onMinuteChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'start' ? 'Set Start Date & Time' : 'Set End Date & Time'}
          </Text>

          <View style={styles.datePickerGrid}>
            <View style={styles.datePickerRow}>
              <View style={styles.datePickerField}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <TextInput
                  style={styles.datePickerInput}
                  keyboardType="number-pad"
                  value={year}
                  onChangeText={onYearChange}
                  maxLength={4}
                  placeholder="YYYY"
                />
              </View>
              <View style={styles.datePickerField}>
                <Text style={styles.datePickerLabel}>Month (1-12)</Text>
                <TextInput
                  style={styles.datePickerInput}
                  keyboardType="number-pad"
                  value={month}
                  onChangeText={onMonthChange}
                  maxLength={2}
                  placeholder="MM"
                />
              </View>
              <View style={styles.datePickerField}>
                <Text style={styles.datePickerLabel}>Day (1-31)</Text>
                <TextInput
                  style={styles.datePickerInput}
                  keyboardType="number-pad"
                  value={day}
                  onChangeText={onDayChange}
                  maxLength={2}
                  placeholder="DD"
                />
              </View>
            </View>

            <View style={styles.datePickerRow}>
              <View style={styles.datePickerField}>
                <Text style={styles.datePickerLabel}>Hour (0-23)</Text>
                <TextInput
                  style={styles.datePickerInput}
                  keyboardType="number-pad"
                  value={hour}
                  onChangeText={onHourChange}
                  maxLength={2}
                  placeholder="HH"
                />
              </View>
              <View style={styles.datePickerField}>
                <Text style={styles.datePickerLabel}>Minute (0-59)</Text>
                <TextInput
                  style={styles.datePickerInput}
                  keyboardType="number-pad"
                  value={minute}
                  onChangeText={onMinuteChange}
                  maxLength={2}
                  placeholder="MM"
                />
              </View>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateTimeModal;
