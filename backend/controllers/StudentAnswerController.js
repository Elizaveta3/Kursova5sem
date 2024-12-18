import mongoose from 'mongoose';
import StudentAnswer from '../../backend/models/student_answer.model.js';
import Account from '../../backend/models/account.model.js';
import Task from '../../backend/models/task.model.js';

export const addAnswer = async (req, res) => {
    try {
        const {taskId, idAccount } = req.body; // Витягуємо статус та ID завдання з тіла запиту

        // Перевірка, чи існує відповідний акаунт
        const accountExists = await Account.findById(idAccount);
        if (!accountExists) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Перевірка існування завдання
        const taskExists = await Task.findById(taskId);
        if (!taskExists) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        // Створення нового студентського відповіді
        const newAnswer = new StudentAnswer({
            student: idAccount,
        });

        // Збереження нової відповіді в базі даних
        const savedAnswer = await newAnswer.save();

        // Оновлення завдання додаванням ID відповіді студента до масиву student_answer
        taskExists.student_answer.push(savedAnswer._id);
        const updatedTask = await taskExists.save();

        res.status(201).json({
            message: 'Відповідь студента успішно додана та завдання оновлене',
            data: {
                savedAnswer,
                updatedTask,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не вдалося додати відповідь студента та оновити завдання',
            error: err.message,
        });
    }
};

export const getStudentAnswer = async (req, res) => {
    try {
        const { taskId, idAccount } = req.body; // Отримання ID завдання та акаунта з тіла запиту

        // Перевірка існування завдання
        const task = await Task.findById(taskId).populate('student_answer');
        if (!task) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        // Пошук відповіді студента серед student_answer
        const studentAnswer = await StudentAnswer.findOne({
            _id: { $in: task.student_answer },
            student: idAccount,
        });

        if (studentAnswer) {
            return res.status(200).json({
                message: 'Відповідь знайдена',
                data: studentAnswer,
            });
        } else {
            return res.status(200).json({
                message: 'Відповідь не знайдена',
                status: 'not_done',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не вдалося знайти відповідь студента',
            error: err.message,
        });
    }
};









