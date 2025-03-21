import PushNotification from 'react-native-push-notification';

class NotificationService {
  configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  showNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      title: title,
      message: message,
    });
  };
}

export const notificationService = new NotificationService();
