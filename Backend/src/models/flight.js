import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    airline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airline',
        required: true,
    },
    flight_number: {
        type: String,
        required: true,
    },
    segments: [
        {
            departure_airport_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Airport',
                required: true,
            },
            arrival_airport_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Airport',
                required: true,
            },
            departure_time: {
                type: Date,
                required: true,
            },
            arrival_time: {
                type: Date,
                required: true,
            },
        },
    ],
    seats_quantity: [
        {
            seat_class_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Seat_Class',
                required: true,
            },
            price: {
                type: mongoose.Schema.Types.Decimal128,
                required: true,
            },
            child_price: {
                type: mongoose.Schema.Types.Decimal128,
                required: true,
            },
            utils: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Utils',
                    required: true,
                },
            ],
            maximum_seat: {
                type: Number,
                required: true,
            },
            current_seat: {
                type: Number,
                required: true,
            },
            carry_on_baggage: {
                type: Number,
                required: true,
            },
            free_baggage: {
                type: Number,
                required: true,
            },
            max_kilogram_baggage: {
                type: Number,
                required: true,
            },
            price_baggage: {
                type: mongoose.Schema.Types.Decimal128,
                required: true,
            },
            changeFlight: {
                type: String,
                required: true,
            },
            refundMoney: {
                type: Number,
            },
        },
    ],
    status: {
        type: String,
        required: true,
    },
});

const flightModel = mongoose.model('Flight', flightSchema, 'Flights');
export default flightModel;
