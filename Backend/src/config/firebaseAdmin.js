import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// import serviceAccount from './flight-booking-platform692004-firebase-adminsdk-fbsvc-54d4e3bd36.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// const e = require('express');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
