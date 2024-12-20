import mongoose from 'mongoose';
import Grade from '../../backend/models/grade.model.js';
import StudentAnswer from '../../backend/models/student_answer.model.js';
import Task from '../../backend/models/task.model.js';

// Додавання оцінки до відповіді студента
export const addGrade = async (req, res) => {
    try {
        const { grade, comment, studentId } = req.body; // Дані оцінки з тіла запиту
        const { studentAnswerId } = req.params; // Отримуємо studentAnswerId з параметрів URL

        // Перевіряємо, чи існує відповідь студента
        const studentAnswer = await StudentAnswer.findById(studentAnswerId);
        if (!studentAnswer) {
            return res.status(404).json({
                message: 'Student answer not found',
            });
        }

        // Створюємо нову оцінку
        const newGrade = new Grade({
            studentAnswerId,
            studentId,
            grade,
            comment,
        });

        // Зберігаємо оцінку
        await newGrade.save();

        // Оновлюємо статус відповіді на "assessed" (оцінено)
        studentAnswer.assessment_status = 'assessed';
        await studentAnswer.save();

        // Повертаємо відповідь клієнту
        res.status(201).json({
            message: 'Grade added successfully',
            grade: newGrade,
            studentAnswer: studentAnswer,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add grade',
        });
    }
};



export const getStudentAnswersWithGrades = async (req, res) => {
    try {
        // Знайти завдання за ID
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        // Отримати всі оцінки для цього завдання
        const grades = await Grade.find({
            studentAnswerId: { $in: task.student_answer }
        })
            .populate({
                path: 'studentAnswerId', // Популяція для studentAnswerId
                populate: {
                    path: 'student', // Популяція для student в studentAnswerId
                    select: 'userName' // Вибірка тільки поля userName з Account
                }
            })
            .select('grade'); // Вибірка тільки поля grade

        // Відправити оцінки у відповідь з userName та grade
        const result = grades.map(grade => ({
            userName: grade.studentAnswerId.student.userName, // Отримати userName студента
            grade: grade.grade // Отримати оцінку
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('Помилка при отриманні оцінок:', error);
        return res.status(500).json({ message: 'Помилка сервера' });
    }
};


