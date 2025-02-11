import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    // Demander la permission
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Permission granted');
        getToken();
      }
    };

    // Récupérer le token FCM
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };

    // Gérer les notifications en arrière-plan
    messaging().onNotificationOpenedApp(remoteMessage => {
      Alert.alert('Notification', JSON.stringify(remoteMessage.notification));
    });

    // Gérer les notifications en premier plan
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Notification reçue', JSON.stringify(remoteMessage.notification));
    });

    // Gérer le cas où l'application est fermée et reçoit une notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          Alert.alert('Notification au démarrage', JSON.stringify(remoteMessage.notification));
        }
      });

    requestPermission();
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World</Text>
    </View>
  );
};

export default App;
