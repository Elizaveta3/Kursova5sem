import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    descrition: {
        type: String,
        required: true,
    },
    deadline: {
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
const Task = mongoose.model('Task',taskSchema);

export default Task;