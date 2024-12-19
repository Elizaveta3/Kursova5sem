import mongoose from 'mongoose';

const studentAnswerSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'done',
    },
    assessment_status: {
        type: String,
        required: true,
        default: 'not assessed',
    }
}, {
    timestamps: true,
});

const StudentAnswer = mongoose.model('StudentAnswer', studentAnswerSchema);

export default StudentAnswer;
