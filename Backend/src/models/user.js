import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    phone: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    birthDay: {
        type: String,
    },
    sex: {
        type: String,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
    },
    provider: {
        type: String,
    },
    providerId: {
        type: String,
    },
});

const userModel = mongoose.model('User', userSchema, 'Users');
export default userModel;
