import mongoose from 'mongoose';

const seatClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const seatClassModel = mongoose.model(
    'Seat_Class',
    seatClassSchema,
    'SeatClass'
);
export default seatClassModel;
