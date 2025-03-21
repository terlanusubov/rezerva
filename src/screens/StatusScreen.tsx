import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, Alert, Platform} from 'react-native';
import {
  StatusManagementProps,
  OfflineOption,
  OfflineSettings,
} from '../types/status';
import StatusHeader from '../components/StatusScreen/StatusHeader';
import StatusCard from '../components/StatusScreen/StatusCard';
import OfflineOptions from '../components/StatusScreen/OfflineOptions';
import CustomDateRange from '../components/StatusScreen/CustomDateRange';
import {styles} from '../components/StatusScreen/styles';
import {
  formatDateForInput,
  formatTimeForInput,
  formatDate,
} from '../utils/dateUtils';
import {updateStatus} from '../services/statusService';

const StatusScreen: React.FC<StatusManagementProps> = ({navigation}) => {
  // Status state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<OfflineOption>(null);
  const [offlineDuration, setOfflineDuration] = useState<string>('');
  const [savedOfflineSettings, setSavedOfflineSettings] =
    useState<OfflineSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderKey, setRenderKey] = useState<number>(0);

  // Date state
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Old date input state (can be removed if not needed elsewhere)
  const [startDateInput, setStartDateInput] = useState<string>(
    formatDateForInput(new Date()),
  );
  const [startTimeInput, setStartTimeInput] = useState<string>(
    formatTimeForInput(new Date()),
  );
  const [endDateInput, setEndDateInput] = useState<string>(
    formatDateForInput(new Date()),
  );
  const [endTimeInput, setEndTimeInput] = useState<string>(
    formatTimeForInput(new Date()),
  );

  // Date picker visibility state
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  // Date picker visibility handlers
  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);
  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  // Log state changes
  useEffect(() => {
    console.log('selectedOption changed:', selectedOption);
  }, [selectedOption]);

  // Handle date changes
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // Also update the text inputs to keep them in sync
    setStartDateInput(formatDateForInput(date));
    setStartTimeInput(formatTimeForInput(date));

    // If end date is before the new start date, update it
    if (endDate < date) {
      const newEndDate = new Date(date);
      newEndDate.setHours(date.getHours() + 1); // Set end date 1 hour after start date
      setEndDate(newEndDate);
      setEndDateInput(formatDateForInput(newEndDate));
      setEndTimeInput(formatTimeForInput(newEndDate));
    }
  };

  const handleEndDateChange = (date: Date) => {
    // Ensure end date is not before start date
    if (date < startDate) {
      Alert.alert('Invalid Date Range', 'End date must be after start date.');
      return;
    }

    setEndDate(date);
    // Also update the text inputs to keep them in sync
    setEndDateInput(formatDateForInput(date));
    setEndTimeInput(formatTimeForInput(date));
  };

  const toggleStatus = () => {
    if (isOnline) {
      // Going offline - show settings
      setIsOnline(false);
      setSelectedOption(null);
    } else {
      // Going online - update backend and UI
      const goOnline = async () => {
        setIsLoading(true);
        const success = await updateStatus(true, false);
        setIsLoading(false);

        if (success) {
          setIsOnline(true);
          setOfflineDuration('');
          setSavedOfflineSettings(null);
          setSelectedOption(null);
        }
      };
      goOnline();
    }
  };

  const selectOption = (type: OfflineOption) => {
    console.log('selectOption called with:', type);

    if (type === 'today') {
      // If "For Today" is selected, immediately set status to offline for today
      setIsLoading(true);

      const handleTodayOption = async () => {
        const today = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Send API request to go offline for today
        const success = await updateStatus(false, true, today, endOfDay);
        setIsLoading(false);

        if (success) {
          // Update UI states
          setIsOnline(false);
          setOfflineDuration('Until end of day');

          // Save settings
          const newSettings: OfflineSettings = {
            startDate: today.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
            durationType: 'today',
          };
          setSavedOfflineSettings(newSettings);

          // This would communicate with native code if needed
          if (
            Platform.OS === 'android' &&
            global.Android &&
            'onStatusSaved' in global.Android
          ) {
            (global.Android as any).onStatusSaved(
              JSON.stringify({
                online: false,
                ...newSettings,
              }),
            );
          }
        }
      };

      handleTodayOption();
    }

    // Always update the selected option
    setSelectedOption(type);

    // For custom option, set default dates
    if (type === 'custom') {
      console.log('Setting up custom date range');
      const today = new Date();
      const oneHourLater = new Date(today);
      oneHourLater.setHours(today.getHours() + 1);

      setStartDate(today);
      setEndDate(oneHourLater);

      // Keep text inputs in sync
      setStartDateInput(formatDateForInput(today));
      setStartTimeInput(formatTimeForInput(today));
      setEndDateInput(formatDateForInput(oneHourLater));
      setEndTimeInput(formatTimeForInput(oneHourLater));

      // Force a re-render
      setRenderKey(prev => prev + 1);
    }
  };

  const saveStatus = async () => {
    if (selectedOption === null) return;

    // Validate inputs for custom option
    if (selectedOption === 'custom') {
      // Check if dates are valid
      if (
        !startDate ||
        !endDate ||
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime())
      ) {
        Alert.alert('Invalid Date', 'Please enter valid date and time values.');
        return;
      }

      // Check that end date is after start date
      if (endDate <= startDate) {
        Alert.alert('Invalid Date Range', 'End date must be after start date.');
        return;
      }
    }

    const isCustom = selectedOption === 'custom';

    // Prepare date values for API
    const offlineStartDate = isCustom ? startDate : new Date();

    // For "today" option, set end date to end of today
    let offlineEndDate;
    if (isCustom) {
      offlineEndDate = endDate;
    } else {
      offlineEndDate = new Date();
      offlineEndDate.setHours(23, 59, 59, 999);
    }

    setIsLoading(true);
    // Update backend
    const success = await updateStatus(
      false,
      true,
      offlineStartDate,
      offlineEndDate,
    );
    setIsLoading(false);

    if (success) {
      // Update UI states
      setIsOnline(false);

      // Show duration text
      const durationText = isCustom
        ? `Until ${formatDate(endDate)}`
        : 'Until end of day';
      setOfflineDuration(durationText);

      // Save settings
      const newSettings: OfflineSettings = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        durationType: isCustom ? 'custom' : 'today',
      };
      setSavedOfflineSettings(newSettings);

      // This would communicate with native code if needed
      if (
        Platform.OS === 'android' &&
        global.Android &&
        'onStatusSaved' in global.Android
      ) {
        (global.Android as any).onStatusSaved(
          JSON.stringify({
            online: false,
            ...newSettings,
          }),
        );
      }
    }
  };

  // Render the component with the key to force re-renders
  return (
    <SafeAreaView style={styles.container} key={renderKey}>
      <StatusHeader navigation={navigation} />

      <ScrollView>
        <StatusCard
          isOnline={isOnline}
          offlineDuration={offlineDuration}
          isLoading={isLoading}
          showToggleButton={!(!isOnline && selectedOption === null)}
          onToggleStatus={toggleStatus}
        />

        {/* Offline Settings */}
        {!isOnline && selectedOption === null && (
          <OfflineOptions
            selectedOption={selectedOption}
            isLoading={isLoading}
            onSelectOption={selectOption}
          />
        )}

        {/* Custom Date Range inputs with new date picker */}
        {selectedOption === 'custom' && (
          <CustomDateRange
            startDate={startDate}
            endDate={endDate}
            isLoading={isLoading}
            isStartDatePickerVisible={isStartDatePickerVisible}
            isEndDatePickerVisible={isEndDatePickerVisible}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onShowStartDatePicker={showStartDatePicker}
            onHideStartDatePicker={hideStartDatePicker}
            onShowEndDatePicker={showEndDatePicker}
            onHideEndDatePicker={hideEndDatePicker}
            onSave={saveStatus}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatusScreen;
