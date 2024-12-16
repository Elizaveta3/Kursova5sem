import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        course_name: {
            type: String,
            required: true,
        },
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
                required: true,
            },
        ],
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;