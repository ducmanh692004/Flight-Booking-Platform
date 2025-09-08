import bcrypt from 'bcryptjs';
import userModel from '../models/user.js';
import groupModal from '../models/group.js';

const userData = [
    {
        fullname: 'Nguyễn Văn A',
        email: 'vana@example.com',
        phone: '0901234567',
        password: 'password1',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Male',
        address: 'Hà Nội',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        providerId: '',
        provider: '',
    },
    {
        fullname: 'Trần Thị B',
        email: 'thib@example.com',
        phone: '0902345678',
        password: 'password2',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Female',
        address: 'Hồ Chí Minh',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        providerId: '',
        provider: '',
    },
    {
        fullname: 'Lê Văn C',
        email: 'vanc@example.com',
        phone: '0903456789',
        password: 'password3',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Male',
        address: 'Đà Nẵng',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        providerId: '',
        provider: '',
    },
    {
        fullname: 'Phạm Thị D',
        email: 'thid@example.com',
        phone: '0904567890',
        password: 'password4',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Female',
        address: 'Hải Phòng',
        image: 'https://randomuser.me/api/portraits/women/4.jpg',
        providerId: '',
        provider: '',
    },
    {
        fullname: 'Hoàng Văn E',
        email: 'vane@example.com',
        phone: '0905678901',
        password: 'password5',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Male',
        address: 'Cần Thơ',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
        providerId: '',
        provider: '',
    },
    {
        fullname: 'Đặng Thị F',
        email: 'thif@example.com',
        phone: '0906789012',
        password: 'password6',
        groupId: '655f3e83b3bba0c1eebf135a',
        sex: 'Female',
        address: 'Nha Trang',
        image: 'https://randomuser.me/api/portraits/women/6.jpg',
        providerId: '',
        provider: '',
    },
];

const seedUsers = async () => {
    try {
        await userModel.deleteMany({});
        const userGroup = await groupModal.findOne({ name: 'client' });

        const hashedUsers = await Promise.all(
            userData.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
                groupId: userGroup._id,
            }))
        );

        const result = await userModel.insertMany(hashedUsers);
        console.log('Users seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

export default seedUsers;
