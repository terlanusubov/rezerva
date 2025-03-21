import {StyleSheet, Platform, StatusBar} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'ios'
        ? 0
        : StatusBar.currentHeight
        ? StatusBar.currentHeight + 20
        : 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: 'white',
    fontSize: 24,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  statusSection: {
    margin: 24,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 12,
        margin: 16, // Less margin on iOS
        padding: 16, // Less padding on iOS
      },
      android: {
        elevation: 5,
      },
    }),
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexWrap: 'nowrap', // Don't wrap on iOS
        height: 90, // Fixed height for consistency
      },
    }),
  },
  statusInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusValueOffline: {
    color: '#dc2626',
  },
  statusValueOnline: {
    color: '#059669',
  },
  statusToggle: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        minWidth: 120,
        width: 150,
        alignSelf: 'flex-end',
        marginLeft: 10,
      },
      android: {
        // Android styling remains the same
      },
    }),
  },
  statusToggleOffline: {
    // Applied when offline toggle button is shown
  },
  statusToggleDisabled: {
    opacity: 0.7,
  },
  toggleGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%', // Make sure it takes full width of parent
    ...Platform.select({
      ios: {
        minWidth: 150,
        height: 44, // Fixed height for iOS
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
    ...Platform.select({
      ios: {
        fontSize: 16,
        textAlign: 'center',
      },
    }),
  },
  offlineSettings: {
    marginTop: 10,
  },
  optionCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  optionCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#6366f1',
  },
  optionCardDisabled: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: 16,
  },
  dateRange: {
    marginTop: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateRangeLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  dateTimeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  dateFormatHelper: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
  },
  offlineDuration: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveGradient: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    // Adding these to ensure consistency on both platforms
    minHeight: 50,
    justifyContent: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dateTimeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerGrid: {
    marginBottom: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerField: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  datePickerInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  confirmButton: {
    backgroundColor: '#4f46e5',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
