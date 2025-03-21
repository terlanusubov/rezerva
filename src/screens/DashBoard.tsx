import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Stats from '../components/Stats';
import AppointmentsList from '../components/Appointments';
import AppointmentModal from '../components/AppointmentModal';
import instance from '../utils/axiosConfig';
import {storage} from '../utils/storage';
import {CommonActions, useNavigation} from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DashboardScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 1 | 2 | 3>(
    'all',
  );
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-300)).current;

  const navigation = useNavigation();

  const BASE_URL = 'http://192.168.88.34:5008/api';
  const APPOINTMENTS_URL = `${BASE_URL}/appointments`;
  const STATUS_URL = `${BASE_URL}/account/status`;

  const fetchAppointments = async () => {
    try {
      const response = await instance.get(APPOINTMENTS_URL);
      setAppointmentsData(response.data.response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openModal = (appointment: any) => {
    // Only set the appointment and show modal if we have valid data
    if (appointment) {
      setSelectedAppointment(appointment);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    // Consider adding a small delay before clearing the selected appointment
    // to prevent UI flicker during the close animation
    setTimeout(() => {
      setSelectedAppointment(null);
    }, 300);
  };

  // Handler for refreshing appointment data after status update
  const handleAppointmentStatusUpdate = () => {
    // Refresh appointments list
    fetchAppointments();
  };

  const handleLogout = async () => {
    try {
      storage.delete('authToken');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Auth'}],
        }),
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    LayoutAnimation.easeInEaseOut();
    if (!menuVisible) {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}

      <Animated.View
        style={[styles.menuPanel, {transform: [{translateX: menuAnimation}]}]}>
        <Text style={styles.menuTitle}>Menu</Text>
        <TouchableOpacity onPress={() => console.log('Navigate to Home')}>
          <Text style={styles.menuItem}>👤 Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Status')}>
          <Text style={styles.menuItem}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.menuItem}>🚪 Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>John</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationText}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Stats
          onSelectFilter={setSelectedFilter}
          data={appointmentsData || []}
        />
        <AppointmentsList
          dataList={appointmentsData || []}
          filter={
            selectedFilter === 1
              ? 1
              : selectedFilter === 2
              ? 2
              : selectedFilter === 3
              ? 3
              : 'all'
          }
          onSelectAppointment={openModal}
        />

        {/* Only render the modal when we have a selected appointment */}
        {selectedAppointment && (
          <AppointmentModal
            visible={modalVisible}
            appointment={selectedAppointment}
            onClose={closeModal}
            onStatusUpdate={handleAppointmentStatusUpdate}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#281A4B',
    padding: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  menuText: {
    color: 'white',
    fontSize: 20,
  },
  greeting: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationText: {
    fontSize: 20,
    color: 'white',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 2, height: 2},
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    color: '#222',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    fontSize: 18,
    color: '#444',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default DashboardScreen;
