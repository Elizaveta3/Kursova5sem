import Grade from '../../backend/models/grade.model.js';
import Task from '../../backend/models/task.model.js';
import Course from '../../backend/models/course.model.js';

// Додавання оцінки до завдання
export const addGrade = async (req, res) => {
    try {
        const { grade, comment, studentId } = req.body; // Дані оцінки з тіла запиту
        const taskId = req.params.taskId; // Отримуємо taskId з параметрів URL

        // Перевіряємо, чи існує завдання
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        // Створюємо нову оцінку
        const newGrade = new Grade({
            taskId,
            studentId,
            grade,
            comment,
        });

        // Зберігаємо оцінку
        await newGrade.save();

        // Опціонально: можна оновити статус завдання на "assessed"
        task.assessment_status = 'assessed';
        await task.save();

        // Повертаємо відповідь клієнту
        res.status(201).json({
            message: 'Grade added successfully',
            grade: newGrade,
            task: task,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add grade',
        });
    }
};

// Отримання оцінок для конкретного завдання
export const getGradesByTask = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Отримуємо taskId з параметрів URL

        // Знаходимо всі оцінки для конкретного завдання
        const grades = await Grade.find({ taskId }).populate('studentId', 'name email'); // Заповнюємо дані студента

        if (grades.length === 0) {
            return res.status(404).json({
                message: 'No grades found for this task',
            });
        }

        res.status(200).json({
            message: 'Grades retrieved successfully',
            grades: grades,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve grades for the task',
        });
    }
};
