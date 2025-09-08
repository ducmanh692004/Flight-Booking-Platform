import groupRoleManagementService from '../../service/admin/groupRoleManagementService.js';

// Group
const createNewGroupFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await groupRoleManagementService.handleCreateGroup(
            formData
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

const deleteGroupFunc = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const data = await groupRoleManagementService.handleDeleteGroup(
            groupId
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

const updateGroupFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await groupRoleManagementService.handleUpdateGroup(
            formData
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

//Role
const getAllRoleFunc = async (req, res) => {
    try {
        const data = await groupRoleManagementService.handleGetAllRole();
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

const getAllRoleOfGroupFunc = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const data = await groupRoleManagementService.handleGetAllRoleOfGroup(
            groupId
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

const createNewRoleFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await groupRoleManagementService.handleCreateRole(
            formData
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

const updateRoleFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await groupRoleManagementService.handleUpdateRole(
            formData
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

const deleteRoleFunc = async (req, res) => {
    try {
        const roleId = req.query.roleId;
        const data = await groupRoleManagementService.handleDeleteRole(roleId);
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

const updateRoleOfGroupFunc = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const listRoles = req.body.listRoles;
        // console.log('check listRoles: ', listRoles);

        const data = await groupRoleManagementService.handleUpdateRoleOfGroup(
            groupId,
            listRoles
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

export default {
    createNewGroupFunc,
    deleteGroupFunc,
    updateGroupFunc,
    getAllRoleFunc,
    getAllRoleOfGroupFunc,
    createNewRoleFunc,
    updateRoleFunc,
    deleteRoleFunc,
    updateRoleOfGroupFunc,
};
