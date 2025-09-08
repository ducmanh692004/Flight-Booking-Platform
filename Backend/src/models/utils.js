import mongoose from 'mongoose';

const utilsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const utilsModel = mongoose.model('Utils', utilsSchema, 'Utils');
export default utilsModel;
