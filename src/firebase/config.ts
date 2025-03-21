import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB6DAdXCNKQkn010RGtzG3zLjYgKDXpPmg',
  authDomain: 'eventh-e2993.firebaseapp.com',
  projectId: 'eventh-e2993',
  storageBucket: 'eventh-e2993.firebasestorage.app',
  messagingSenderId: '1059411456767',
  appId: '1:1059411456767:web:3eb9eb240e979c9d1252ca',
  measurementId: 'G-XTY1DZ8QX6',
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

console.log('Firebase has been initialized');

export {firebase, analytics, messaging};
