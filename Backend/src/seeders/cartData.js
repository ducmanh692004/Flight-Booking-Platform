import cartModel from '../models/cart.js';

const cartData = [
    {
        user_id: '6858f0c4303ceb86f3fa71de',
        cart_items: [],
    },
];

const seedCarts = async () => {
    try {
        // await cartModel.deleteMany({});
        const insertedCarts = await cartModel.insertMany(cartData);
        console.log('Carts seeded successfully:', insertedCarts);
    } catch (error) {
        console.error('Error seeding carts:', error);
    }
};

export default seedCarts;
