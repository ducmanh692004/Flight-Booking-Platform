import userManagementService from '../../service/admin/userManagementService.js';

const getAllUserFunc = async (req, res) => {
    try {
        const data = await userManagementService.handleGetAllUser();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const updateUserFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await userManagementService.handleUpdateUser(formData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const deleteUserFunc = async (req, res) => {
    try {
        const userId = req.query.userId;
        const data = await userManagementService.handleDeleteUser(userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const createUserFunc = () => {
    try {
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const getAllGroupFunc = async (req, res) => {
    try {
        const data = await userManagementService.handleGetAllGroup();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const createNewUserFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await userManagementService.handleCreateNewUser(formData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const getAllSupportFunc = async (req, res) => {
    try {
        const currentPage = req.query.currentPage;
        const currentLimit = req.query.currentLimit;
        const data = await userManagementService.handleGetAllSupport(
            currentPage,
            currentLimit
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const deleteSupportFunc = async (req, res) => {
    try {
        const supportId = req.query.supportId;
        const data = await userManagementService.handleDeleteSupport(supportId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const getRevenueFunc = async (req, res) => {
    try {
        const data = await userManagementService.handleGetRevenueInformation();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    getAllUserFunc,
    updateUserFunc,
    deleteUserFunc,
    createUserFunc,
    getAllGroupFunc,
    createNewUserFunc,
    getAllSupportFunc,
    deleteSupportFunc,
    getRevenueFunc,
};
