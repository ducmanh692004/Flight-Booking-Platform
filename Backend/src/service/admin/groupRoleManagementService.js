import group from '../../models/group.js';
import role from '../../models/role.js';

const handleCreateGroup = async (formData) => {
    try {
        const checkGroup = await group.findOne({ name: formData.name });
        if (checkGroup) {
            return {
                EM: 'Group already exists',
                EC: -1,
                DT: [],
            };
        }

        await group.create({
            name: formData.name,
            description: formData.description,
        });

        return {
            EM: 'Create group successfully! ',
            EC: 0,
            DT: group,
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

// const handleGetAllGroup = async () => {
//     try {
//         const groupData = await group.find({}).select('name');
//         return {
//             EM: 'Get all group successfully! ',
//             EC: 0,
//             DT: groupData,
//         };
//     } catch (error) {
//         return {
//             EM: 'error from server',
//             EC: -1,
//             DT: [],
//         };
//     }
// };

const handleGetAllRoleOfGroup = async (groupId) => {
    try {
        const roleData = await group.find({ _id: groupId }).select('listRoles');
        return {
            EM: 'Get all role successfully! ',
            EC: 0,
            DT: roleData,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateGroup = async (formData) => {
    try {
        // const group = await group.findOneAndUpdate(
        //     { _id: groupId },
        //     groupData,
        //     { new: true }
        // );
        return {
            EM: 'Update group successfully! ',
            EC: 0,
            DT: group,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteGroup = async (groupId) => {
    try {
        // const group = await group.findOneAndDelete({ _id: groupId });
        //////// validateeeee
        return {
            EM: 'Delete group successfully! ',
            EC: 0,
            DT: group,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetAllRole = async () => {
    try {
        const roleData = await role.find();
        return {
            EM: 'Get all role successfully! ',
            EC: 0,
            DT: roleData,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleCreateRole = async (roleData) => {
    try {
        const checkRole = await role.findOne({ url: roleData.url });
        if (checkRole) {
            return {
                EM: 'Role already exists',
                EC: -1,
                DT: [],
            };
        }
        await role.create(roleData);
        return {
            EM: 'Create role successfully! ',
            EC: 0,
            DT: role,
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

const handleUpdateRole = async (formData) => {
    try {
        await role.update(
            {
                _id: formData._id,
            },
            {
                name: formData.name,
                url: formData.url,
            }
        );
        return {
            EM: 'Update role successfully! ',
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

const handleDeleteRole = async (roleId) => {
    try {
        await role.deleteOne({ _id: roleId });
        return {
            EM: 'Delete role successfully! ',
            EC: 0,
            DT: role,
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

const handleUpdateRoleOfGroup = async (groupId, listRoles) => {
    try {
        // console.log('check groupID: ', groupId);
        await group.update(
            {
                _id: groupId,
            },
            {
                listRoles: listRoles,
            }
        );
        return {
            EM: 'Update role of group successfully! ',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleGetAllRole,
    handleGetAllRoleOfGroup,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleUpdateRoleOfGroup,
};
