import Student from '../../backend/models/student.model.js'
import Group from '../../backend/models/group.model.js';
import Course from '../../backend/models/course.model.js';
import Account from '../../backend/models/account.model.js';

export const addStudent = async (req, res) => {
    try {
        const { idAccount, idGroup, idCourses, name } = req.body; // idCourses тепер масив ID курсів

        // Перевірка, чи існує відповідний акаунт
        const accountExists = await Account.findById(idAccount);
        if (!accountExists) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Перевірка існування групи
        const groupExists = await Group.findById(idGroup);
        if (!groupExists) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Перевірка існування курсів
        const coursesExist = await Course.find({ '_id': { $in: idCourses } });
        if (coursesExist.length !== idCourses.length) {
            return res.status(404).json({ message: 'One or more courses not found' });
        }

        // Створення нового студента
        const student = new Student({
            account: idAccount,
            group: idGroup,
            courses: idCourses, // Масив курсів
            name,
        });

        await student.save();

        res.status(201).json({
            message: 'Student added successfully',
            student,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add student',
        });
    }
};

export const getStudentByAccountId = async (req, res) => {
    try {
        const accountId = req.params.id; // Отримуємо ID акаунта з параметрів запиту

        // Знаходимо студента за ID акаунта
        const student = await Student.findOne({ account: accountId })  // Використовуємо findOne, щоб знайти студента по полю 'account'
            .populate('account', 'userName email') // Заповнюємо акаунт, щоб отримати ім'я та email
            .populate('group', 'group_name') // Заповнюємо групу, щоб отримати її назву
            .populate('courses', 'course_name'); // Заповнюємо курси, щоб отримати їхні назви

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Відправляємо знайдену інформацію про студента
        res.status(200).json({
            studentId: student._id,
            name: student.name,
            account: student.account, // Інформація про акаунт
            group: student.group, // Інформація про групу
            courses: student.courses, // Інформація про курси
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не вдалося знайти інформацію про студента',
        });
    }
};