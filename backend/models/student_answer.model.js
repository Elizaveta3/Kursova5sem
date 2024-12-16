import mongoose from 'mongoose';

const studentAnswerSchema = new mongoose.Schema({
        file: {
            type: String,
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        }
    },
    {
        timestamps: true,
    }
);
const StudentAnswer = mongoose.model('Student',studentAnswerShema);

export default StudentAnswer;