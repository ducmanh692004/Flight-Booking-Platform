import mongoose, { Mongoose } from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    listRoles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
    ],
});

const groupModel = mongoose.model('Group', groupSchema, 'Groups');
export default groupModel;
