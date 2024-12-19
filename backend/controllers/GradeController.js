import Grade from '../../backend/models/grade.model.js';
import StudentAnswer from '../../backend/models/student_answer.model.js';

// Додавання оцінки до відповіді студента
export const addGrade = async (req, res) => {
    try {
        const { grade, comment, studentId } = req.body; // Дані оцінки з тіла запиту
        const studentAnswerId = req.params.studentAnswerId; // Отримуємо studentAnswerId з параметрів URL

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

        // Опціонально: можна оновити статус відповіді на "assessed" (оцінено)
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
// Отримання оцінок для конкретної відповіді студента
export const getGradesByStudentAnswer = async (req, res) => {
    try {
        const studentAnswerId = req.params.studentAnswerId; // Отримуємо studentAnswerId з параметрів URL

        // Знаходимо всі оцінки для конкретної відповіді студента
        const grades = await Grade.find({ studentAnswerId }).populate('studentId', 'name email'); // Заповнюємо дані студента

        if (grades.length === 0) {
            return res.status(404).json({
                message: 'No grades found for this student answer',
            });
        }

        res.status(200).json({
            message: 'Grades retrieved successfully',
            grades: grades,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve grades for the student answer',
        });
    }
};