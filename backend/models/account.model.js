import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true, 
    },
    role: {
        type: String,
        required: true, 
        enum: ['teacher', 'student'],
    },
},
{
    timestamps: true,
}
);
const Account = mongoose.model('Account',accountSchema);

export default Account;