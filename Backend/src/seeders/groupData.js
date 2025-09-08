import groupModel from '../models/group.js';

const groupData = [
    {
        name: 'admin',
        description: 'Administrator control app',
    },
    {
        name: 'client',
        description: 'Client in app',
    },
];

const seedGroups = async () => {
    try {
        await groupModel.deleteMany({});
        const insertedGroups = await groupModel.insertMany(groupData);

        console.log('Groups seeded successfully:', insertedGroups);
    } catch (error) {
        console.error('Error seeding groups:', error);
    }
};

export default seedGroups;
