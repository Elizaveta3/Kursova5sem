import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    course_name: {
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
const Course = mongoose.model('Course',courseSchema);

export default Course;