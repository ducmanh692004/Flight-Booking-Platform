import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    flight_departure_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    flight_comeback_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
    },
    seat_class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat_Class',
        required: true,
    },
    peopleQuantity: {
        type: Object,
        required: true,
    },
});

const cartItemModel = mongoose.model('Cart_Item', cartItemSchema, 'CartItems');
export default cartItemModel;
