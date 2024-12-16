import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            }
        ]
    },
    {
        timestamps: true,
    }
);
const Student = mongoose.model('Student',studentSchema);

export default Student;