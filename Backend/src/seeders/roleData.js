import roleModel from '../models/role.js';
import groupModel from '../models/group.js';

const takeGroupUserid = async () => {
    try {
        let data = await groupModel.findOne({ name: 'client' });
        if (data && data._id) {
            return data._id;
        }
    } catch (error) {
        console.error('error', error);
    }
};

const roleData = [
    { name: 'user view ticket', url: '/user/viewTicket' },
    {
        name: 'user order ticket',
        url: '/user/orderTicket',
    },
];

const seedRoles = async () => {
    try {
        await roleModel.deleteMany({});
        const groupUserId = await takeGroupUserid();

        const roleDataResolve = roleData.map((role) => ({
            ...role,
            groupId: groupUserId,
        }));
        const result = await roleModel.insertMany(roleDataResolve);
        console.log('Roles seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

export default seedRoles;
