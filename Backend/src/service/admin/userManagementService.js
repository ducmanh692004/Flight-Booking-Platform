import group from '../../models/group.js';
import user from '../../models/user.js';
import cancelRefundOrderService from '../cancelRefundOrder.js';
import orderService from '../orderApiService.js';
import authApiService from '../authApiService.js';
import cart from '../../models/cart.js';
import support from '../../models/support.js';
import flight from '../../models/flight.js';
import order from '../../models/order.js';
import airline from '../../models/airline.js';
import airport from '../../models/airport.js';
import cartService from '../cartService.js';

const handleGetAllUser = async () => {
    try {
        const data = await user.find();
        return {
            EM: 'success',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateUser = async (formData) => {
    try {
        const data = await user.findByIdAndUpdate(formData._id, {
            $set: formData,
        });
        if (!data) {
            return {
                EM: 'Something wrong in update user process!',
                EC: -1,
                DT: [],
            };
        }

        return {
            EM: 'Update user information success',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteUser = async (userId) => {
    try {
        const data = user.findById(userId);
        if (!data) {
            return {
                EM: 'User not found',
                EC: -1,
                DT: [],
            };
        }

        const deleteRefund =
            await cancelRefundOrderService.deleteAllUserRefundOrder(userId);
        if (deleteRefund === false) {
            return {
                EM: 'Something wrong in delete refund order process!',
                EC: -1,
                DT: [],
            };
        }

        const deleteOrder = await orderService.deleteAllUserOrder(userId);
        if (deleteOrder === false) {
            return {
                EM: 'Something wrong in delete order process!',
                EC: -1,
                DT: [],
            };
        }

        const deleteCart = await cartService.deleteCartUser(userId);
        if (deleteCart === false) {
            return {
                EM: 'Something wrong in delete cart process!',
                EC: -1,
                DT: [],
            };
        }

        const dataDelete = await user.findByIdAndDelete(userId);
        return {
            EM: 'Delete all information of account success',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetAllGroup = async () => {
    try {
        const groupData = await group.find().select('name');
        if (!groupData) {
            return {
                EM: 'System does not have group',
                EC: -1,
                DT: [],
            };
        }

        return {
            EM: 'Get all group successfully!',
            EC: 0,
            DT: groupData,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleCreateNewUser = async (formData) => {
    try {
        const checkEmail = await user.findOne({ email: formData.email });
        if (checkEmail) {
            return {
                EM: 'Email already registered!',
                EC: -1,
                DT: [],
            };
        }

        const passwordHash = await authApiService.hashUserPassword(
            formData.password
        );

        const data = await user.create({
            email: formData.email,
            fullname: formData.fullname,
            password: passwordHash,
            groupId: formData.groupId,
            phone: formData.phone || '',
            address: formData.address || '',
            sex: formData.sex || '',
        });

        const checkGroup = await group.findOne({ _id: formData.groupId });
        if (checkGroup.name === 'client') {
            await cart.create({ user_id: data._id });
        }

        return {
            EM: 'Create new user successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetAllSupport = async (page, limit) => {
    try {
        const data = await support
            .find({})
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPage = await support.countDocuments({});
        return {
            EM: 'Get all support successfully!',
            EC: 0,
            DT: {
                data: data,
                totalPage: Math.ceil(totalPage / limit),
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteSupport = async (supportId) => {
    try {
        await support.findByIdAndDelete(supportId);
        return {
            EM: 'Delete support successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetRevenueInformation = async () => {
    try {
        const totalOrder = await order.countDocuments({});
        const totalAirline = await airline.countDocuments({});
        const totalAirport = await airport.countDocuments({});
        const totalFlight = await flight.countDocuments({});
        const orderBooked = await order.countDocuments({
            $or: [
                { status: 'Đã thanh toán' },
                { status: 'Đang chờ hoàn tiền' },
            ],
        });
        const orderCancel = await order.countDocuments({
            status: 'Đã hoàn tiền',
        });
        const allOrderPaymented = await order
            .find({
                $or: [
                    { status: 'Đã thanh toán' },
                    { status: 'Đang chờ hoàn tiền' },
                ],
            })
            .select(
                'totalFlightDeparturePrice totalFlightComebackPrice totalSeatDetailPrice discountValue totalBaggagePrice'
            );

        // console.log('hiiii', allOrderPaymented);
        // const orderPaymented = await order.countDocuments({ status: '' });

        let totalRevenue = 0;
        for (let i = 0; i < allOrderPaymented.length; i++) {
            const total =
                Number(allOrderPaymented[i].totalFlightDeparturePrice) +
                Number(allOrderPaymented[i].totalFlightComebackPrice) +
                Number(allOrderPaymented[i].totalSeatDetailPrice) +
                Number(allOrderPaymented[i].totalBaggagePrice) -
                Number(allOrderPaymented[i].discountValue);
            totalRevenue += total;
            // console.log(
            //     'hiiii',
            //     Number(allOrderPaymented[i].totalFlightDeparturePrice)
            // );
        }

        // console.log('rrrrrr', totalRevenue);
        return {
            EM: 'Get revenue information successfully!',
            EC: 0,
            DT: {
                totalOrder: totalOrder,
                totalAirline: totalAirline,
                totalAirport: totalAirport,
                totalFlight: totalFlight,
                orderBooked: orderBooked,
                orderCancel: orderCancel,
                totalRevenue: totalRevenue,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleGetAllUser,
    handleUpdateUser,
    handleDeleteUser,
    handleGetAllGroup,
    handleCreateNewUser,
    handleGetAllSupport,
    handleDeleteSupport,
    handleGetRevenueInformation,
};
