import cabinModel from '../models/cabin.js';

const generateCabinMap = (layout, totalSeats) => {
    const seatLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const seatsPerRow = layout.reduce((a, b) => a + b, 0);

    const cabin_map = [];
    let currentSeat = 0;
    let row = 1;

    while (currentSeat < totalSeats) {
        const rowSeats = [];
        for (let i = 0; i < seatsPerRow && currentSeat < totalSeats; i++) {
            const seat_number = seatLabels[i];
            rowSeats.push({ seat_number, status: 'available' });
            currentSeat++;
        }
        cabin_map.push({ row, seats: rowSeats });
        row++;
    }

    return cabin_map;
};

const flightId = '6853b900de7caa4ee67215d1';

const cabinData = [
    {
        flight_id: flightId,
        seat_class_id: '684c0f64351062930ad28ff5', // Phổ thông
        layout: [3, 3],
        price_normal_seat: '55000',
        price_window_seat: '65000',
        total_rows: Math.ceil(200 / 6),
        cabin_map: generateCabinMap([3, 3], 200),
    },
    {
        flight_id: flightId,
        seat_class_id: '684c0f64351062930ad28ff6', // Cao cấp
        layout: [2, 2],
        price_normal_seat: '60000',
        price_window_seat: '70000',
        total_rows: Math.ceil(40 / 4),
        cabin_map: generateCabinMap([2, 2], 40),
    },
    {
        flight_id: flightId,
        seat_class_id: '684c0f64351062930ad28ff7', // Thương gia
        layout: [2, 2],
        price_normal_seat: '85000',
        price_window_seat: '100000',
        total_rows: Math.ceil(30 / 4),
        cabin_map: generateCabinMap([2, 2], 30),
    },
    {
        flight_id: flightId,
        seat_class_id: '684c0f64351062930ad28ff8', // Hạng nhất
        layout: [1, 1],
        price_normal_seat: '110000',
        price_window_seat: '125000',
        total_rows: Math.ceil(10 / 2),
        cabin_map: generateCabinMap([1, 1], 10),
    },
];

const seedCabins = async () => {
    try {
        // await cabinModel.deleteMany({ flight_id: flightId }); // tuỳ chọn nếu muốn reset cabin
        const insertedCabins = await cabinModel.insertMany(cabinData);
        console.log(
            'Cabins seeded successfully:',
            insertedCabins.length,
            'cabins'
        );
    } catch (error) {
        console.error('Error seeding cabins:', error);
    }
};

export default seedCabins;
