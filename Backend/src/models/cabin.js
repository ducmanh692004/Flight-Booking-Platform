import mongoose from 'mongoose';

const cabinShema = new mongoose.Schema({
    flight_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    seat_class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat_Class',
        required: true,
    },
    layout: {
        type: [Number],
        required: true,
    },
    price_normal_seat: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    price_window_seat: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    cabin_map: [
        {
            row: Number,
            seats: [
                {
                    seat_number: {
                        type: String,
                        required: true,
                    },
                    status: {
                        type: String,
                        required: true,
                    },
                    passenger_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                },
            ],
        },
    ],
});

const cabinModel = mongoose.model('Cabin', cabinShema, 'Cabins');
export default cabinModel;
