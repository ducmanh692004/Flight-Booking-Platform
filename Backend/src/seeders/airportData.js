import airportModel from '../models/airport.js';

const airportData = [
    // Sân bay Việt Nam
    {
        name: 'Sân bay Quốc tế Nội Bài',
        code: 'HAN',
        country: 'Việt Nam',
        province: 'Hà Nội',
    },
    {
        name: 'Sân bay Quốc tế Tân Sơn Nhất',
        code: 'SGN',
        country: 'Việt Nam',
        province: 'Thành phố Hồ Chí Minh',
    },
    {
        name: 'Sân bay Quốc tế Đà Nẵng',
        code: 'DAD',
        country: 'Việt Nam',
        province: 'Đà Nẵng',
    },
    {
        name: 'Sân bay Quốc tế Cam Ranh',
        code: 'CXR',
        country: 'Việt Nam',
        province: 'Khánh Hòa',
    },
    {
        name: 'Sân bay Quốc tế Phú Quốc',
        code: 'PQC',
        country: 'Việt Nam',
        province: 'Kiên Giang',
    },
    {
        name: 'Sân bay Quốc tế Cát Bi',
        code: 'HPH',
        country: 'Việt Nam',
        province: 'Hải Phòng',
    },
    {
        name: 'Sân bay Quốc tế Vinh',
        code: 'VII',
        country: 'Việt Nam',
        province: 'Nghệ An',
    },
    {
        name: 'Sân bay Quốc tế Phú Bài (Huế)',
        code: 'HUI',
        country: 'Việt Nam',
        province: 'Thừa Thiên Huế',
    },
    {
        name: 'Sân bay Buôn Ma Thuột',
        code: 'BMV',
        country: 'Việt Nam',
        province: 'Đắk Lắk',
    },
    {
        name: 'Sân bay Quốc tế Cần Thơ',
        code: 'VCA',
        country: 'Việt Nam',
        province: 'Cần Thơ',
    },
    {
        name: 'Sân bay Liên Khương',
        code: 'DLI',
        country: 'Việt Nam',
        province: 'Lâm Đồng',
    },
    {
        name: 'Sân bay Pleiku',
        code: 'PXU',
        country: 'Việt Nam',
        province: 'Gia Lai',
    },
    {
        name: 'Sân bay Rạch Giá',
        code: 'VKG',
        country: 'Việt Nam',
        province: 'Kiên Giang',
    },
    {
        name: 'Sân bay Cà Mau',
        code: 'CAH',
        country: 'Việt Nam',
        province: 'Cà Mau',
    },
    {
        name: 'Sân bay Đồng Hới',
        code: 'VDH',
        country: 'Việt Nam',
        province: 'Quảng Bình',
    },
    {
        name: 'Sân bay Quy Nhơn',
        code: 'UIH',
        country: 'Việt Nam',
        province: 'Bình Định',
    },
    {
        name: 'Sân bay Tuy Hòa',
        code: 'TBB',
        country: 'Việt Nam',
        province: 'Phú Yên',
    },
    {
        name: 'Sân bay Điện Biên Phủ',
        code: 'DIN',
        country: 'Việt Nam',
        province: 'Điện Biên',
    },
    {
        name: 'Sân bay Thọ Xuân',
        code: 'THD',
        country: 'Việt Nam',
        province: 'Thanh Hóa',
    },
    {
        name: 'Sân bay Quốc tế Chu Lai',
        code: 'VCL',
        country: 'Việt Nam',
        province: 'Quảng Nam',
    },

    // Sân bay Quốc tế - Châu Á
    {
        name: 'Sân bay Quốc tế Suvarnabhumi',
        code: 'BKK',
        country: 'Thái Lan',
        province: 'Bangkok',
    },
    {
        name: 'Sân bay Changi Singapore',
        code: 'SIN',
        country: 'Singapore',
        province: 'Singapore',
    },
    {
        name: 'Sân bay Quốc tế Kuala Lumpur',
        code: 'KUL',
        country: 'Malaysia',
        province: 'Selangor',
    },
    {
        name: 'Sân bay Quốc tế Hồng Kông',
        code: 'HKG',
        country: 'Hồng Kông',
        province: 'Chek Lap Kok',
    },
    {
        name: 'Sân bay Quốc tế Incheon',
        code: 'ICN',
        country: 'Hàn Quốc',
        province: 'Seoul',
    },
    {
        name: 'Sân bay Quốc tế Narita',
        code: 'NRT',
        country: 'Nhật Bản',
        province: 'Chiba',
    },
    {
        name: 'Sân bay Quốc tế Haneda',
        code: 'HND',
        country: 'Nhật Bản',
        province: 'Tokyo',
    },
    {
        name: 'Sân bay Quốc tế Phố Đông Thượng Hải',
        code: 'PVG',
        country: 'Trung Quốc',
        province: 'Thượng Hải',
    },
    {
        name: 'Sân bay Quốc tế Thủ đô Bắc Kinh',
        code: 'PEK',
        country: 'Trung Quốc',
        province: 'Bắc Kinh',
    },
    {
        name: 'Sân bay Quốc tế Bạch Vân Quảng Châu',
        code: 'CAN',
        country: 'Trung Quốc',
        province: 'Quảng Đông',
    },
    {
        name: 'Sân bay Quốc tế Đào Viên Đài Bắc',
        code: 'TPE',
        country: 'Đài Loan',
        province: 'Đào Viên',
    },
    {
        name: 'Sân bay Quốc tế Ninoy Aquino',
        code: 'MNL',
        country: 'Philippines',
        province: 'Manila',
    },
    {
        name: 'Sân bay Quốc tế Indira Gandhi',
        code: 'DEL',
        country: 'Ấn Độ',
        province: 'Delhi',
    },
    {
        name: 'Sân bay Quốc tế Bandaranaike',
        code: 'CMB',
        country: 'Sri Lanka',
        province: 'Tỉnh Tây',
    },
    {
        name: 'Sân bay Quốc tế Tribhuvan',
        code: 'KTM',
        country: 'Nepal',
        province: 'Kathmandu',
    },
    {
        name: 'Sân bay Quốc tế Hamad', // Đã sửa tên sân bay
        code: 'DOH',
        country: 'Qatar',
        province: 'Doha',
    },
    {
        name: 'Sân bay Quốc tế Dubai',
        code: 'DXB',
        country: 'UAE',
        province: 'Dubai',
    },
    {
        name: 'Sân bay Quốc tế Abu Dhabi',
        code: 'AUH',
        country: 'UAE',
        province: 'Abu Dhabi',
    },
    {
        name: 'Sân bay Quốc tế King Fahd',
        code: 'DMM',
        country: 'Ả Rập Xê Út',
        province: 'Tỉnh Đông',
    },
    {
        name: 'Sân bay Quốc tế Ben Gurion',
        code: 'TLV',
        country: 'Israel',
        province: 'Quận Trung tâm',
    },
    {
        name: 'Sân bay Quốc tế Malé Velana', // Tên đầy đủ
        code: 'MLE',
        country: 'Maldives',
        province: 'Hulhulé',
    },
    {
        name: 'Sân bay Quốc tế Kansai',
        code: 'KIX',
        country: 'Nhật Bản',
        province: 'Osaka',
    },
    {
        name: 'Sân bay Quốc tế Jeju',
        code: 'CJU',
        country: 'Hàn Quốc',
        province: 'Jeju',
    },
    {
        name: 'Sân bay Quốc tế Giang Bắc Trùng Khánh',
        code: 'CKG',
        country: 'Trung Quốc',
        province: 'Trùng Khánh',
    },
    {
        name: 'Sân bay Quốc tế Trường Thủy Côn Minh',
        code: 'KMG',
        country: 'Trung Quốc',
        province: 'Vân Nam',
    },
    {
        name: 'Sân bay Quốc tế Song Lưu Thành Đô',
        code: 'CTU',
        country: 'Trung Quốc',
        province: 'Tứ Xuyên',
    },
    {
        name: 'Sân bay Helsinki-Vantaa',
        code: 'HEL',
        country: 'Phần Lan',
        province: 'Vantaa',
    },
    {
        name: 'Sân bay Khabarovsk Novy',
        code: 'KHV',
        country: 'Nga',
        province: 'Vùng Khabarovsk',
    },
    {
        name: 'Sân bay Quốc tế Vladivostok',
        code: 'VVO',
        country: 'Nga',
        province: 'Vùng Primorsky',
    },
    {
        name: 'Sân bay Quốc tế Chinggis Khaan Ulaanbaatar',
        code: 'ULN',
        country: 'Mông Cổ',
        province: 'Ulaanbaatar',
    },

    // Sân bay Quốc tế - Châu Âu
    {
        name: 'Sân bay Heathrow',
        code: 'LHR',
        country: 'Vương quốc Anh',
        province: 'London',
    },
    {
        name: 'Sân bay Charles de Gaulle',
        code: 'CDG',
        country: 'Pháp',
        province: 'Paris',
    },
    {
        name: 'Sân bay Frankfurt',
        code: 'FRA',
        country: 'Đức',
        province: 'Hesse',
    },
    {
        name: 'Sân bay Schiphol Amsterdam',
        code: 'AMS',
        country: 'Hà Lan',
        province: 'Bắc Holland',
    },
    {
        name: 'Sân bay Madrid-Barajas',
        code: 'MAD',
        country: 'Tây Ban Nha',
        province: 'Madrid',
    },
    {
        name: 'Sân bay Fiumicino Rome',
        code: 'FCO',
        country: 'Ý',
        province: 'Lazio',
    },
    {
        name: 'Sân bay Munich',
        code: 'MUC',
        country: 'Đức',
        province: 'Bavaria',
    },
    {
        name: 'Sân bay Istanbul',
        code: 'IST',
        country: 'Thổ Nhĩ Kỳ',
        province: 'Istanbul',
    },
    {
        name: 'Sân bay Zurich',
        code: 'ZRH',
        country: 'Thụy Sĩ',
        province: 'Zurich',
    },
    {
        name: 'Sân bay Copenhagen',
        code: 'CPH',
        country: 'Đan Mạch',
        province: 'Copenhagen',
    },
    {
        name: 'Sân bay Oslo, Gardermoen',
        code: 'OSL',
        country: 'Na Uy',
        province: 'Akershus',
    },
    {
        name: 'Sân bay Arlanda Stockholm',
        code: 'ARN',
        country: 'Thụy Điển',
        province: 'Stockholm',
    },
    {
        name: 'Sân bay Dublin',
        code: 'DUB',
        country: 'Ireland',
        province: 'Dublin',
    },
    {
        name: 'Sân bay Lisbon',
        code: 'LIS',
        country: 'Bồ Đào Nha',
        province: 'Lisbon',
    },
    {
        name: 'Sân bay Quốc tế Vienna',
        code: 'VIE',
        country: 'Áo',
        province: 'Hạ Áo',
    },
    {
        name: 'Sân bay Brussels',
        code: 'BRU',
        country: 'Bỉ',
        province: 'Flanders',
    },
    {
        name: 'Sân bay Chopin Warsaw',
        code: 'WAW',
        country: 'Ba Lan',
        province: 'Voivodeship Masovian',
    },
    {
        name: 'Sân bay Quốc tế Ferenc Liszt Budapest',
        code: 'BUD',
        country: 'Hungary',
        province: 'Budapest',
    },
    {
        name: 'Sân bay Vaclav Havel Prague',
        code: 'PRG',
        country: 'Cộng hòa Séc',
        province: 'Prague',
    },
    {
        name: 'Sân bay Barcelona-El Prat',
        code: 'BCN',
        country: 'Tây Ban Nha',
        province: 'Catalonia',
    },

    // Sân bay Quốc tế - Bắc Mỹ
    {
        name: 'Sân bay Quốc tế Los Angeles',
        code: 'LAX',
        country: 'Hoa Kỳ',
        province: 'California',
    },
    {
        name: 'Sân bay Quốc tế John F. Kennedy',
        code: 'JFK',
        country: 'Hoa Kỳ',
        province: 'New York',
    },
    {
        name: 'Sân bay Quốc tế Hartsfield-Jackson Atlanta',
        code: 'ATL',
        country: 'Hoa Kỳ',
        province: 'Georgia',
    },
    {
        name: "Sân bay Quốc tế O'Hare Chicago",
        code: 'ORD',
        country: 'Hoa Kỳ',
        province: 'Illinois',
    },
    {
        name: 'Sân bay Quốc tế Dallas/Fort Worth',
        code: 'DFW',
        country: 'Hoa Kỳ',
        province: 'Texas',
    },
    {
        name: 'Sân bay Quốc tế Denver',
        code: 'DEN',
        country: 'Hoa Kỳ',
        province: 'Colorado',
    },
    {
        name: 'Sân bay Quốc tế San Francisco',
        code: 'SFO',
        country: 'Hoa Kỳ',
        province: 'California',
    },
    {
        name: 'Sân bay Quốc tế Miami',
        code: 'MIA',
        country: 'Hoa Kỳ',
        province: 'Florida',
    },
    {
        name: 'Sân bay Quốc tế Seattle-Tacoma',
        code: 'SEA',
        country: 'Hoa Kỳ',
        province: 'Washington',
    },
    {
        name: 'Sân bay Quốc tế Toronto Pearson',
        code: 'YYZ',
        country: 'Canada',
        province: 'Ontario',
    },
    {
        name: 'Sân bay Quốc tế Vancouver',
        code: 'YVR',
        country: 'Canada',
        province: 'British Columbia',
    },
    {
        name: 'Sân bay Quốc tế Thành phố Mexico',
        code: 'MEX',
        country: 'Mexico',
        province: 'Thành phố Mexico',
    },
    {
        name: 'Sân bay Quốc tế Cancun',
        code: 'CUN',
        country: 'Mexico',
        province: 'Quintana Roo',
    },
    {
        name: 'Sân bay Quốc tế Washington Dulles',
        code: 'IAD',
        country: 'Hoa Kỳ',
        province: 'Virginia',
    },
    {
        name: 'Sân bay Quốc tế George Bush Liên lục địa Houston',
        code: 'IAH',
        country: 'Hoa Kỳ',
        province: 'Texas',
    },
    {
        name: 'Sân bay Quốc tế Boston Logan',
        code: 'BOS',
        country: 'Hoa Kỳ',
        province: 'Massachusetts',
    },
    {
        name: 'Sân bay Quốc tế Charlotte Douglas',
        code: 'CLT',
        country: 'Hoa Kỳ',
        province: 'Bắc Carolina',
    },
    {
        name: 'Sân bay Quốc tế Harry Reid Las Vegas', // Tên mới của Sân bay McCarran
        code: 'LAS',
        country: 'Hoa Kỳ',
        province: 'Nevada',
    },
    {
        name: 'Sân bay Quốc tế Orlando',
        code: 'MCO',
        country: 'Hoa Kỳ',
        province: 'Florida',
    },
    {
        name: 'Sân bay Quốc tế Montréal–Pierre Elliott Trudeau',
        code: 'YUL',
        country: 'Canada',
        province: 'Quebec',
    },

    // Sân bay Quốc tế - Châu Úc/Châu Đại Dương
    {
        name: 'Sân bay Sydney Kingsford Smith', // Tên đầy đủ
        code: 'SYD',
        country: 'Úc',
        province: 'New South Wales',
    },
    {
        name: 'Sân bay Melbourne Tullamarine', // Tên đầy đủ
        code: 'MEL',
        country: 'Úc',
        province: 'Victoria',
    },
    {
        name: 'Sân bay Brisbane',
        code: 'BNE',
        country: 'Úc',
        province: 'Queensland',
    },
    {
        name: 'Sân bay Auckland',
        code: 'AKL',
        country: 'New Zealand',
        province: 'Auckland',
    },
    {
        name: 'Sân bay Quốc tế Nadi',
        code: 'NAN',
        country: 'Fiji',
        province: 'Viti Levu',
    },

    // Sân bay Quốc tế - Nam Mỹ
    {
        name: 'Sân bay Quốc tế Guarulhos – Governador André Franco Montoro', // Tên đầy đủ
        code: 'GRU',
        country: 'Brazil',
        province: 'São Paulo',
    },
    {
        name: 'Sân bay Quốc tế Ministro Pistarini (Ezeiza)', // Tên đầy đủ
        code: 'EZE',
        country: 'Argentina',
        province: 'Buenos Aires',
    },
    {
        name: 'Sân bay Quốc tế El Dorado',
        code: 'BOG',
        country: 'Colombia',
        province: 'Bogotá',
    },
    {
        name: 'Sân bay Quốc tế Jorge Chávez',
        code: 'LIM',
        country: 'Peru',
        province: 'Callao',
    },
    {
        name: 'Sân bay Quốc tế Comodoro Arturo Merino Benítez',
        code: 'SCL',
        country: 'Chile',
        province: 'Santiago',
    },

    // Sân bay Quốc tế - Châu Phi
    {
        name: 'Sân bay Quốc tế O. R. Tambo',
        code: 'JNB',
        country: 'Nam Phi',
        province: 'Gauteng',
    },
    {
        name: 'Sân bay Quốc tế Cairo',
        code: 'CAI',
        country: 'Ai Cập',
        province: 'Tỉnh Cairo',
    },
    {
        name: 'Sân bay Quốc tế Mohammed V',
        code: 'CMN',
        country: 'Ma-rốc',
        province: 'Casablanca-Settat',
    },
    {
        name: 'Sân bay Quốc tế Jomo Kenyatta',
        code: 'NBO',
        country: 'Kenya',
        province: 'Hạt Nairobi',
    },
    {
        name: 'Sân bay Quốc tế Addis Ababa Bole',
        code: 'ADD',
        country: 'Ethiopia',
        province: 'Addis Ababa',
    },
];

const seedAirports = async () => {
    try {
        await airportModel.deleteMany({});
        const result = await airportModel.insertMany(airportData);
        console.log('Airports seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding airports:', error);
    }
};

export default seedAirports;
