import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    logo_url: {
        type: String,
        required: true,
    },
    cloudinary_public_id: {
        type: String,
        required: true,
    },
});

const airlineModel = mongoose.model('Airline', airlineSchema, 'Airlines');
export default airlineModel;
