import seatClassManagementService from '../../service/admin/seatClassManagementService.js';

const getAllSeatClassFunc = async (req, res) => {
    try {
        const data = await seatClassManagementService.handleGetAllSeatClass();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const createNewSeatClassFunc = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const data = await seatClassManagementService.handleCreateNewSeatClass(
            name,
            description
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const updateSeatClassFunc = async (req, res) => {
    try {
        const id = req.body._id;
        const name = req.body.name;
        const description = req.body.description;

        const data = await seatClassManagementService.handleUpdateSeatClass(
            id,
            name,
            description
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const deleteSeatClassFunc = async (req, res) => {
    try {
        const id = req.query.seatClassId;
        const data = await seatClassManagementService.handleDeleteSeatClass(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

export default {
    getAllSeatClassFunc,
    createNewSeatClassFunc,
    updateSeatClassFunc,
    deleteSeatClassFunc,
};
