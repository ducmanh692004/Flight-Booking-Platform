// const mongoose = require('mongoose');
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connecteddd: ${conn.connection.host}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default connection;
