import mongoose from 'mongoose';
import Grade from '../../backend/models/grade.model.js';
import StudentAnswer from '../../backend/models/student_answer.model.js';
import Task from '../../backend/models/task.model.js';

import Student from '../../backend/models/student.model.js';
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
export const getGradesForTask = async (req, res) => {
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
        }).select('grade -_id'); // Вибірка тільки поля grade без _id

        // Перетворити результат у масив оцінок
        const gradeArray = grades.map((g) => g.grade);

        // Відправити лише масив оцінок
        return res.status(200).json(gradeArray);
    } catch (error) {
        console.error('Помилка при отриманні оцінок:', error);
        return res.status(500).json({ message: 'Помилка сервера' });
    }
};
export const getGradeForStudentAnswer = async (req, res) => {
    try {
        // Отримати параметри запиту
        const { taskId, studentId } = req.params;

        // Знайти завдання за ID
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        // Знайти відповіді студентів за посиланнями з task.student_answer
        const studentAnswers = await StudentAnswer.find({
            _id: { $in: task.student_answer }
        });

        // Знайти відповідь конкретного студента
        const studentAnswer = studentAnswers.find(
            (answer) => answer.student.toString() === studentId
        );

        if (!studentAnswer) {
            return res.status(404).json({ message: 'Відповідь студента не знайдена' });
        }

        // Знайти оцінку для цієї відповіді
        const grade = await Grade.findOne({
            studentAnswerId: studentAnswer._id
        }).select('grade comment -_id'); // Вибірка також для поля comment

        if (!grade) {
            return res.status(404).json({ message: 'Оцінка не знайдена' });
        }

        // Відправити оцінку і коментар
        return res.status(200).json({
            grade: grade.grade, // Виправлено: використано grade замість grades
            comment: grade.comment || "Без коментаря" // Додано умову на випадок відсутності коментаря
        });

    } catch (error) {
        console.error('Помилка при отриманні оцінки:', error);
        return res.status(500).json({ message: 'Помилка сервера' });
    }
};
