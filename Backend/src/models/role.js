import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const roleModel = mongoose.model('Role', roleSchema, 'Roles');
export default roleModel;
