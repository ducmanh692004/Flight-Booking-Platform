import utilsModal from '../models/utils';

const utilsData = [
    { name: 'Wifi miễn phí' },
    { name: 'Suất ăn miễn phí' },
    { name: 'Giải trí trên máy bay' },
    { name: 'Cổng sạc thiết bị' },
    { name: 'Ghế ngả lưng thoải mái' },
    { name: 'Hành lý ký gửi miễn phí' },
    { name: 'Ưu tiên lên máy bay' },
    { name: 'Sảnh chờ VIP' },
    { name: 'Khăn nóng' },
    { name: 'Đồ uống miễn phí' },
    { name: 'Tai nghe chống ồn' },
    { name: 'Chăn và gối' },
    { name: 'Kết nối Bluetooth' },
    { name: 'TV cá nhân' },
    { name: 'Khay bàn ăn riêng' },
    { name: 'Rèm che ánh sáng' },
    { name: 'Phòng tắm riêng' },
    { name: 'Giường nằm' },
    { name: 'Dịch vụ gọi tiếp viên' },
    { name: 'Màn hình cảm ứng' },
];

const seedUtils = async () => {
    try {
        await utilsModal.deleteMany({});

        const result = await utilsModal.insertMany(utilsData);
        console.log('Utils seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding utils:', error);
    }
};

export default seedUtils;
