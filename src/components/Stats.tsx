import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface StatsComponentProps {
  onSelectFilter: (
    filter: 'all' | 'waiting' | 'confirmed' | 'cancelled',
  ) => void;
  data: Array<{status: number}>;
}

const Stats: React.FC<StatsComponentProps> = ({onSelectFilter, data}) => {
  console.log('Data:', data);

  const countAppointments = (status: number) => {
    return data
      ? data.filter(appointment => appointment.status === status).length
      : 0;
  };

  const todaysAppointmentsCount = countAppointments(2);
  const cancelledCount = countAppointments(3);
  const waitingApprovalCount = countAppointments(1);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.statCard}
        onPress={() => onSelectFilter('all')}>
        <Text style={styles.statNumber}>{todaysAppointmentsCount}</Text>
        <Text style={styles.statLabel}>Today's Appointments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={() => onSelectFilter('cancelled')}>
        <Text style={styles.statNumber}>{cancelledCount}</Text>
        <Text style={styles.statLabel}>Cancelled Today</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={() => onSelectFilter('waiting')}>
        <Text style={styles.statNumber}>{waitingApprovalCount}</Text>
        <Text style={styles.statLabel}>Waiting Approval</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Stats;
