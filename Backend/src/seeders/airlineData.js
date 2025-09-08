import airlineModel from '../models/airline.js';

const airlineData = [
    // Hãng hàng không Việt Nam
    {
        name: 'Vietnam Airlines',
        country: 'Vietnam',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/2/27/Vietnam_Airlines_logo.svg',
    },
    {
        name: 'VietJet Air',
        country: 'Vietnam',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/4/4b/VietJet_Air_logo.svg',
    },
    {
        name: 'Bamboo Airways',
        country: 'Vietnam',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/e/e9/Bamboo_Airways_logo.svg',
    },
    {
        name: 'Vietravel Airlines',
        country: 'Vietnam',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/6/6f/Vietravel_Airlines_logo.svg',
    },
    {
        name: 'Pacific Airlines',
        country: 'Vietnam',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/f/fe/Pacific_Airlines_logo.svg',
    },
    // Hãng hàng không Quốc tế phổ biến
    {
        name: 'Emirates',
        country: 'United Arab Emirates',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/d/d6/Emirates_logo.svg',
    },
    {
        name: 'Qatar Airways',
        country: 'Qatar',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/2/29/Qatar_Airways_Logo.svg',
    },
    {
        name: 'Singapore Airlines',
        country: 'Singapore',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/d/db/Singapore_Airlines_Logo.svg',
    },
    {
        name: 'Cathay Pacific',
        country: 'Hong Kong',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/f/f6/Cathay_Pacific_logo.svg',
    },
    {
        name: 'EVA Air',
        country: 'Taiwan',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/d/d4/EVA_Air_logo.svg',
    },
    {
        name: 'ANA (All Nippon Airways)',
        country: 'Japan',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/b/b3/All_Nippon_Airways_logo.svg',
    },
    {
        name: 'Japan Airlines (JAL)',
        country: 'Japan',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Japan_Airlines_logo.svg/640px-Japan_Airlines_logo.svg.png',
    },
    {
        name: 'Korean Air',
        country: 'South Korea',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/e/e2/Korean_Air_logo.svg',
    },
    {
        name: 'Turkish Airlines',
        country: 'Turkey',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/8/87/Turkish_Airlines_logo.svg',
    },
    {
        name: 'Lufthansa',
        country: 'Germany',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/b/b9/Lufthansa_Logo_2018.svg',
    },
    {
        name: 'Air France',
        country: 'France',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/c/c9/Air_France_Logo.svg',
    },
    {
        name: 'British Airways',
        country: 'United Kingdom',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/7/75/British_Airways_logo_2019.svg',
    },
    {
        name: 'Delta Air Lines',
        country: 'United States',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/f/f8/Delta_Air_Lines_logo.svg',
    },
    {
        name: 'United Airlines',
        country: 'United States',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/United_Airlines_logo_2019.svg/640px-United_Airlines_logo_2019.svg.png',
    },
    {
        name: 'American Airlines',
        country: 'United States',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/6/6f/American_Airlines_logo_2013.svg',
    },
    {
        name: 'Qantas',
        country: 'Australia',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/e/e5/Qantas_Logo.svg',
    },
    {
        name: 'Air Canada',
        country: 'Canada',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/2/25/Air_Canada_logo.svg',
    },
    {
        name: 'KLM Royal Dutch Airlines',
        country: 'Netherlands',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/e/e6/KLM_logo.svg',
    },
    {
        name: 'Swiss International Air Lines',
        country: 'Switzerland',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/7/76/Swiss_International_Air_Lines_logo.svg',
    },
    {
        name: 'Thai Airways',
        country: 'Thailand',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/2/27/Thai_Airways_logo.svg',
    },
    {
        name: 'Malaysia Airlines',
        country: 'Malaysia',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/7/7b/Malaysia_Airlines_logo.svg',
    },
    {
        name: 'Garuda Indonesia',
        country: 'Indonesia',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/6/6f/Garuda_Indonesia_logo.svg',
    },
    {
        name: 'Philippine Airlines',
        country: 'Philippines',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/4/4b/Philippine_Airlines_logo.svg',
    },
    {
        name: 'Air New Zealand',
        country: 'New Zealand',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/1/1b/Air_New_Zealand_logo.svg',
    },
    {
        name: 'Virgin Atlantic',
        country: 'United Kingdom',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/a/a2/Virgin_Atlantic_logo.svg',
    },
];

const seedAirlines = async () => {
    try {
        await airlineModel.deleteMany({});
        const insertedAirlines = await airlineModel.insertMany(airlineData);

        console.log('Airlines seeded successfully:', insertedAirlines);
    } catch (error) {
        console.error('Error seeding airlines:', error);
    }
};

export default seedAirlines;
