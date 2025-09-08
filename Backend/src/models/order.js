import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    captureId: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    flightDepartureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    flightComebackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
    },
    seatClassDepartureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat_Class',
        required: true,
    },
    seatClassComebackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat_Class',
    },
    peopleQuantity: {
        type: Object,
        required: true,
    },
    totalFlightDeparturePrice: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    totalFlightComebackPrice: {
        type: mongoose.Schema.Types.Decimal128,
    },
    totalBaggagePrice: {
        type: mongoose.Schema.Types.Decimal128,
    },
    totalSeatDetailPrice: {
        type: mongoose.Schema.Types.Decimal128,
    },
    discountValue: {
        type: mongoose.Schema.Types.Decimal128,
    },
    seatDetailDataDeparture: {
        type: Object,
        required: true,
    },
    seatDetailDataComeback: {
        type: Object,
    },
    baggageDataDeparture: {
        type: Object,
        required: true,
    },
    baggageDataComeback: {
        type: Object,
    },
    formData: {
        type: Object,
        required: true,
    },
    formDataChild: {
        type: Object,
    },
    formDataAdult: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const orderModel = mongoose.model('Order', orderSchema, 'Orders');
export default orderModel;
