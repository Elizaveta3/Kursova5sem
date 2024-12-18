import mongoose from 'mongoose';

const studentAnswerSchema = new mongoose.Schema({
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'done',
        }
    },
    {
        timestamps: true,
    }
);
const StudentAnswer = mongoose.model('StudentAnswer', studentAnswerSchema);

export default StudentAnswer;