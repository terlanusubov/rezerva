import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const statusStyles: Record<number, object> = {
  1: {backgroundColor: '#fef3c7'}, // waiting
  2: {backgroundColor: '#d1fae5'}, // confirmed
  3: {backgroundColor: '#fee2e2'}, // cancelled
};

const statusText: Record<number, string> = {
  1: 'Waiting',
  2: 'Accepted',
  3: 'Canceled',
};

interface AppointmentsListProps {
  filter: 'all' | 1 | 2 | 3;
  onSelectAppointment: (appointment: any) => void;
  dataList: Array<{
    id: number;
    bookedTimeStart: string;
    bookedTimeEnd: string;
    service: string;
    customerName: string;
    customerSurname: string;
    customerEmail: string;
    customerPhoneNumber: string;
    bookedDate: string;
    status: number;
  }>;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  filter,
  onSelectAppointment,
  dataList,
}) => {
  const filteredAppointments =
    filter === 'all'
      ? dataList
      : dataList?.filter(appointment => appointment.status === filter);

  const getTitle = () => {
    switch (filter) {
      case 1:
        return 'Waiting Approval';
      case 2:
        return "Today's Confirmed Appointments";
      case 3:
        return 'Cancelled Appointments';
      default:
        return "Today's Appointments";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{getTitle()}</Text>
      <ScrollView>
        {filteredAppointments?.map(appointment => (
          <TouchableOpacity
            key={appointment.id}
            style={styles.appointmentCard}
            onPress={() => onSelectAppointment(appointment)}>
            <Text style={styles.appointmentTime}>
              {appointment.bookedTimeStart} - {appointment.bookedTimeEnd}
            </Text>
            <Text style={styles.appointmentService}>{appointment.service}</Text>
            <View style={styles.appointmentClientRow}>
              <Text style={styles.appointmentClient}>
                {appointment.customerName} {appointment.customerSurname}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  statusStyles[appointment.status] || {},
                ]}>
                <Text style={styles.statusText}>
                  {statusText[appointment.status]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentTime: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  appointmentService: {
    fontWeight: '600',
    marginBottom: 4,
  },
  appointmentClientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appointmentClient: {
    color: '#6b7280',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AppointmentsList;
