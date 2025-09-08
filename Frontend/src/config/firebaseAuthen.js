// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCyANELzmMGOsE0N0hLgSoxpPYxiAybuyo',
    authDomain: 'flight-booking-platform692004.firebaseapp.com',
    projectId: 'flight-booking-platform692004',
    storageBucket: 'flight-booking-platform692004.firebasestorage.app',
    messagingSenderId: '622192542716',
    appId: '1:622192542716:web:81656ca58f0177cfd16879',
    measurementId: 'G-PEBK3BZFPW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export { auth, provider, facebookProvider };
