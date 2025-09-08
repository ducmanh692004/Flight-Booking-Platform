import airlineManagementService from '../../service/admin/airlineManagementService.js';
// const cloudinary = require('cloudinary').v2;

const getAllAirlineFunc = async (req, res) => {
    try {
        const currentLimit = req.query.currentLimit;
        const currentPage = req.query.currentPage;
        const data = await airlineManagementService.handleGetAllAirline(
            currentLimit,
            currentPage
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const createNewAirlineFunc = async (req, res) => {
    try {
        const name = req.body.name;
        const country = req.body.country;
        const logoFile = req.file;
        const data = await airlineManagementService.handleCreateNewAirline(
            name,
            country,
            logoFile.buffer,
            logoFile.mimetype,
            logoFile.originalname
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const updateAirlineFunc = async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const country = req.body.country;
        const logoFile = req.file;

        const data = await airlineManagementService.handleUpdateAirline(
            id,
            name,
            country,
            logoFile?.buffer,
            logoFile?.mimetype,
            logoFile?.originalname
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const deleteAirlineFunc = async (req, res) => {
    try {
        const airlineId = req.query.airlineId;
        const data = await airlineManagementService.handleDeleteAirline(
            airlineId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    getAllAirlineFunc,
    createNewAirlineFunc,
    updateAirlineFunc,
    deleteAirlineFunc,
};
