// const cloudinary = require('cloudinary').v2;
import airportManagementService from '../../service/admin/airportManagementService.js';

const getAllAirportFunc = async (req, res) => {
    try {
        const currentPage = req.query.currentPage;
        const currentLimit = req.query.currentLimit;
        const data = await airportManagementService.handleGetAllAirport(
            currentPage,
            currentLimit
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

const createNewAirportFunc = async (req, res) => {
    try {
        const name = req.body.name;
        const code = req.body.code;
        const country = req.body.country;
        const province = req.body.province;
        const time_zon = req.body.time_zon;
        const image = req.file;

        const data = await airportManagementService.handleCreateNewAirport(
            name,
            code,
            country,
            province,
            time_zon,
            image.buffer,
            image.mimetype,
            image.originalname
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

const updateAirportFunc = async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const code = req.body.code;
        const country = req.body.country;
        const province = req.body.province;
        const time_zon = req.body.time_zon;
        const image = req.file;

        const data = await airportManagementService.handleUpdateAirport(
            id,
            name,
            code,
            country,
            province,
            time_zon,
            image?.buffer,
            image?.mimetype,
            image?.originalname
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

const deleteAirportFunc = async (req, res) => {
    try {
        const airportId = req.query.airportId;
        const data = await airportManagementService.handleDeleteAirport(
            airportId
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
    getAllAirportFunc: getAllAirportFunc,
    createNewAirportFunc: createNewAirportFunc,
    updateAirportFunc: updateAirportFunc,
    deleteAirportFunc: deleteAirportFunc,
};
