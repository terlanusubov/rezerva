import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import instance from '../utils/axiosConfig';

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: {
    id: string | number;
    service: string;
    customerName: string;
    customerSurname: string;
    customerPhoneNumber: string;
    status: number;
    notes: string;
    bookedDate: string;
    bookedTimeStart: string;
  } | null;
  onStatusUpdate: () => void; // Added to refresh appointments list
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  visible,
  onClose,
  appointment,
  onStatusUpdate,
}) => {
  // State to track if we're in edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(400)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // Guard clause - early return if appointment is null
  if (!appointment) return null;

  // Initialize local status with appointment status
  useEffect(() => {
    if (appointment) {
      setLocalStatus(appointment.status);
    }
  }, [appointment]);

  // Safely format the date after we've confirmed appointment exists
  const formattedDate = appointment.bookedDate
    ? new Date(appointment.bookedDate).toISOString().split('T')[0]
    : '';

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose();
        // Reset edit mode when modal closes
        setIsEditing(false);
      });
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        pan.setValue({x: 0, y: gestureState.dy});
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Function to handle status change
  const handleStatusChange = async (statusId: number) => {
    setIsLoading(true);
    try {
      const response = await instance.put(
        `appointments/${appointment.id}/status`,
        {
          statusId: statusId,
        },
      );

      if (response.data && response.data.isSuccess) {
        // Update local status
        setLocalStatus(statusId);
        // Call the callback to refresh appointments list
        onStatusUpdate();
      } else {
        console.error('Failed to update status:', response.data);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map status to text
  const statusText: Record<number, string> = {
    1: 'Waiting',
    2: 'Accepted',
    3: 'Cancelled',
  };

  // Map status to style
  const statusStyles: Record<number, object> = {
    1: {backgroundColor: '#fef3c7'}, // waiting
    2: {backgroundColor: '#d1fae5'}, // confirmed
    3: {backgroundColor: '#fee2e2'}, // cancelled
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          Animated.timing(slideAnim, {
            toValue: 400,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onClose());
        }}
      />
      <Animated.View
        style={[styles.modalContainer, {transform: [{translateY: slideAnim}]}]}
        {...panResponder.panHandlers}>
        <View style={styles.modalHandle} />

        {/* Client Header */}
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {appointment.customerName} {appointment.customerSurname}
            </Text>
            <Text style={styles.clientPhone}>
              {appointment.customerPhoneNumber}
            </Text>
          </View>
          {localStatus && (
            <View style={[styles.statusBadge, statusStyles[localStatus]]}>
              <Text style={styles.statusText}>{statusText[localStatus]}</Text>
            </View>
          )}
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{appointment.service}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {formattedDate}, {appointment.bookedTimeStart}
            </Text>
          </View>
        </View>

        {/* Notes Section */}
        {appointment.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Client Notes</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#6366f1" />
          ) : localStatus === 2 ? (
            // When the appointment is confirmed/accepted, still show the Decline button
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleStatusChange(3)}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          ) : localStatus === 3 ? (
            // When the appointment is already declined, show the Accept button to allow re-accepting
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleStatusChange(2)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          ) : (
            // Show both Accept and Decline buttons for new/waiting appointments
            <>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleStatusChange(3)}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleStatusChange(2)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  clientAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  clientPhone: {
    color: '#6b7280',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontWeight: '500',
    color: '#1f2937',
  },
  price: {
    color: '#059669',
    fontWeight: '600',
  },
  notesSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    minHeight: 56, // Add min height to prevent layout jumps during loading
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34d399',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f59e0b', // Amber/warning color
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default AppointmentModal;
