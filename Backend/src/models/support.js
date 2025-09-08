import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
    },
    emailContact: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const supportsModel = mongoose.model('Support', supportSchema, 'Supports');
export default supportsModel;
