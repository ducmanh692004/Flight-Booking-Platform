import seedUser from '../seeders/userData';
import seedAirline from '../seeders/airlineData';
import seedAirport from '../seeders/airportData';
import seedCoupon from '../seeders/couponData';
import seedRole from '../seeders/roleData';
import seedGroup from '../seeders/groupData';
import seedFlight from '../seeders/flightData';
// import seedBookings from '../seeders/bookingData';
import seedCart from '../seeders/cartData';
import seedSeatClass from '../seeders/seatClassData';
import seedUtils from '../seeders/utilsData';
import seedCartItem from './cartItemData';
import seedCabin from '../seeders/cabinData';
import mongoose from 'mongoose';
// const connection = require('../config/connection');

const clearDatabase = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.deleteMany({});
            console.log(`Cleared: ${collectionName}`);
        } catch (err) {
            console.error(`Error clearing ${collectionName}:`, err);
        }
    }
};

const runSeeders = async () => {
    try {
        // await clearDatabase();

        // await seedGroup();
        // await seedUser();
        // await seedAirline();
        // await seedAirport();
        // await seedCoupon();
        // await seedSeatClass();
        // await seedUser();
        // await seedRole();
        // await seedTickets();
        await seedFlight();
        // await seedUtils();
        // await seedBookings();
        // await seedCart();
        // await seedCartItem();
        // await seedCabin();

        console.log('All seeders completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeders:', error);
        process.exit(1);
    }
};

export default runSeeders;
