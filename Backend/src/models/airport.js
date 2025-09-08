import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    time_zon: {
        type: String,
        required: true,
    },
    image_province: {
        type: String,
        // required: true,
    },
    cloudinary_public_id: {
        type: String,
        // required: true,
    },
});

const airportModel = mongoose.model('Airport', airportSchema, 'Airports');
export default airportModel;
