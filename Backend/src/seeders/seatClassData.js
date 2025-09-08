import seatClassModel from '../models/seatClass.js';

const seatClassData = [
    {
        name: 'Hạng phổ thông',
        description: 'Hạng phổ thông với giá vé hợp lý, tiện nghi cơ bản',
    },
    {
        name: 'Hạng cao cấp',
        description: 'Ghế rộng hơn hạng phổ thông, nhiều tiện ích hơn',
    },
    {
        name: 'Hạng thương gia',
        description: 'Ghế rộng và ngả thoải mái, phục vụ chuyên nghiệp',
    },
    {
        name: 'Hạng nhất',
        description: 'Dịch vụ cao cấp nhất với ghế riêng và tiện nghi hàng đầu',
    },
];

const seedSeatClasses = async () => {
    try {
        await seatClassModel.deleteMany({});

        const result = await seatClassModel.insertMany(seatClassData);
        console.log('Seat classes seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding seat classes:', error);
    }
};

export default seedSeatClasses;
