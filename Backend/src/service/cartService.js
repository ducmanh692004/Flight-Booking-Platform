import cartModel from '../models/cart.js';
import cartItem from '../models/cartItem.js';
import flightService from './flightService.js';

const handleAsyncCartData = async (cartData, userId) => {
    try {
        const cartInformation = await cartModel.findOne({
            user_id: userId,
        });

        if (cartData.length > 0 && cartInformation._id) {
            const cartDataInsert = cartData.map((order) => {
                // console.log(order.seats_quantity);
                return {
                    cart_id: cartInformation._id,
                    flight_departure_id: order.dataFlightDeparture._id,
                    flight_comeback_id: order.dataFlightComeback?._id,
                    seat_class:
                        order.dataFlightDeparture.seats_quantity[0]
                            .seat_class_id._id,
                    peopleQuantity: order.peopleQuantity,
                };
            });
            await cartItem.insertMany(cartDataInsert);
        }

        const dataCartUser = await cartItem.find({
            cart_id: cartInformation._id,
        });

        const dataCartFinal = await Promise.all(
            dataCartUser.map(async (item) => {
                const dataFlightDeparture =
                    await flightService.takeFlightDataForCart(
                        item.flight_departure_id,
                        item.seat_class
                    );

                let dataFlightComeback = {};
                // console.log('aaaa:', item);
                // console.log(item.flight_comeback_id);

                if (item.flight_comeback_id) {
                    dataFlightComeback =
                        await flightService.takeFlightDataForCart(
                            item.flight_comeback_id,
                            item.seat_class
                        );
                }

                return {
                    id: item._id,
                    dataFlightDeparture: dataFlightDeparture,
                    dataFlightComeback: dataFlightComeback,
                    peopleQuantity: item.peopleQuantity,
                };
            })
        );

        return {
            EM: 'Get cart data successfully!',
            EC: 0,
            DT: dataCartFinal,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleAddCartItem = async (userId, itemAdd) => {
    try {
        const cartInformation = await cartModel.findOne({
            user_id: userId,
        });
        if (cartInformation) {
            const dataCreate = await cartItem.create({
                cart_id: cartInformation._id,
                flight_departure_id: itemAdd.flight_departure_id,
                flight_comeback_id: itemAdd?.flight_comeback_id,
                seat_class: itemAdd.seat_class,
                peopleQuantity: itemAdd.people_quantity,
            });

            return {
                EM: 'Add cart item successfully!',
                EC: 0,
                DT: dataCreate._id,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteCartItem = async (cartItemId) => {
    try {
        await cartItem.findByIdAndDelete(cartItemId);
        return {
            EM: 'Delete cart item successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const deleteCartUser = async (userId) => {
    try {
        let data = await cartModel.findOne({ user_id: userId });
        if (data) {
            await cartItem.deleteMany({ cart_id: data._id });
        }
        await cartModel.findOneAndDelete({ user_id: userId });

        return true;
    } catch (error) {
        return false;
    }
};

export default {
    handleAsyncCartData,
    handleAddCartItem,
    handleDeleteCartItem,
    deleteCartUser,
};
