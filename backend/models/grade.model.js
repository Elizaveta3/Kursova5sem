import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Зв'язок з колекцією завдань
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Опціональний зв'язок зі студентами
        required: true,
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Оцінка в діапазоні 0-100 (можна налаштувати)
    },
    comment: {
        type: String,
        default: '',
    },
}, { timestamps: true });

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;
