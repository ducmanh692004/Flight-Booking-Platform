import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const cartModel = mongoose.model('Cart', cartSchema, 'Carts');
export default cartModel;
