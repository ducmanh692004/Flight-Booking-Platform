import cartItemModel from '../models/cartItem.js';

const cartItemData = [
    {
        cart_id: '6858d6e0023e39c279a8debb',
        flight_departure_id: '684fee2b88a4b8d10859040d',
        seat_class: '684c0f64351062930ad28ff5',
        peopleQuantity: {
            adult: 1,
            child: 0,
        },
    },
    {
        cart_id: '6858d6e0023e39c279a8debb',
        flight_departure_id: '68502eaf4025a10f019d7a58',
        flight_comeback_id: '6853b900de7caa4ee67215ca',
        seat_class: '6853b900de7caa4ee67215cd',
        peopleQuantity: {
            adult: 4,
            child: 2,
        },
    },
];

const seedCartItem = async () => {
    try {
        await cartItemModel.deleteMany({});
        const result = await cartItemModel.insertMany(cartItemData);
        console.log('CartItems seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding cartItems:', error);
    }
};

export default seedCartItem;
