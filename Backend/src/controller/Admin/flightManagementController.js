import flightManagementService from '../../service/admin/flightManagementService.js';

const getAllFlightFunc = async (req, res) => {
    try {
        const currentLimit = req.query.currentLimit;
        const currentPage = req.query.currentPage;
        const data = await flightManagementService.handleGetAllFlight(
            currentLimit,
            currentPage
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const getDetailFlightFunc = async (req, res) => {
    try {
        const flightId = req.query.flightId;
        const data = await flightManagementService.handleGetDetailFlight(
            flightId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const createNewFlightFunc = async (req, res) => {
    try {
        const flightData = req.body.formData;
        // console.log('viewww: ', flightData);
        const data = await flightManagementService.handleCreateNewFlight(
            flightData
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const getFlightToUpdateFunc = async (req, res) => {
    try {
        const flightId = req.query.flightId;
        const data = await flightManagementService.handleGetFlightDataToUpdate(
            flightId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const updateFlightFunc = async (req, res) => {
    try {
        const data = await flightManagementService.handleUpdateFlight(
            req.body.formData
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const deleteFlightFunc = async (req, res) => {
    try {
        const flightId = req.query.flightId;
        const data = await flightManagementService.handleDeleteFlight(flightId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const searchDestinationSuggestionFunc = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const data =
            await flightManagementService.handleSearchDestinationSuggestion(
                keyword
            );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const searchAirlineSuggestionFunc = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const data =
            await flightManagementService.handleSearchAirlineSuggestion(
                keyword
            );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const getAllSeatClassFunc = async (req, res) => {
    try {
        const data = await flightManagementService.handleFetchAllSeatClass();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const getAllUtilsFunc = async (req, res) => {
    try {
        const data = await flightManagementService.handleFetchAllUtils();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

export default {
    getAllFlightFunc,
    getDetailFlightFunc,
    createNewFlightFunc,
    getFlightToUpdateFunc,
    updateFlightFunc,
    deleteFlightFunc,
    searchDestinationSuggestionFunc,
    searchAirlineSuggestionFunc,
    getAllUtilsFunc,
    getAllSeatClassFunc,
};
