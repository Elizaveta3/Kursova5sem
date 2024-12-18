import Task from '../../backend/models/task.model.js';
import Course from '../../backend/models/course.model.js';
import Student from '../models/student.model.js';


export const addTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body; // Отримуємо title, description та deadline з тіла запиту
        const courseId = req.params.courseId; // Отримуємо courseId з параметрів URL

        // Створення нового завдання
        const newTask = new Task({
            title,
            description,
            deadline,
            submission_status: 'not submitted',
            assessment_status: 'not assessed',
        });

        // Збереження завдання в базі
        await newTask.save();

        // Оновлення курсу: додавання нового завдання до списку завдань
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            });
        }

        course.tasks.push(newTask._id); // Додаємо ID нового завдання в масив tasks
        await course.save(); // Зберігаємо оновлений курс

        // Відправлення відповіді клієнту
        res.status(201).json({
            message: 'Task added and course updated successfully',
            task: newTask,
            course: course,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add task and update course',
        });
    }
};


export const getTasksByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId; // Отримуємо courseId з параметрів URL

        // Знаходимо курс за ID
        const course = await Course.findById(courseId).populate('tasks'); // Використовуємо populate, щоб автоматично заповнити завдання

        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            });
        }

        // Повертаємо список завдань цього курсу
        res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks: course.tasks,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve tasks for the course',
        });
    }
};

export const getTaskSubmissionStats = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Знаходимо завдання за ID
        const task = await Task.findById(taskId).populate('student_answer');

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        // Знаходимо курс, до якого належить це завдання
        const course = await Course.findOne({ tasks: taskId }).populate('groups');
        if (!course) {
            return res.status(404).json({
                message: 'Course not found for this task',
            });
        }

        // Отримуємо всіх студентів у групах курсу
        const students = await Student.find({ group: { $in: course.groups } });

        const totalStudents = students.length; // Загальна кількість студентів у курсі
        const totalSubmissions = task.student_answer.length; // Кількість відповідей
        const notSubmitted = totalStudents - totalSubmissions >= 0 ? totalStudents - totalSubmissions : 0;

        // Формуємо відповідь
        res.status(200).json({
            message: 'Task submission stats retrieved successfully',
            stats: {
                totalStudents,
                totalSubmissions,
                notSubmitted,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve task submission stats',
            error: err.message,
        });
    }
};


