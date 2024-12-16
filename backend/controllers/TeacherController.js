import Teacher from '../../backend/models/teacher.model.js';
import Account from '../../backend/models/account.model.js';

export const addTeacher = async (req, res) => {
    try {
        const { accountId, name, courses } = req.body;

        // Перевірка, чи існує акаунт з заданим ID
        const existingAccount = await Account.findById(accountId);
        if (!existingAccount) {
            return res.status(404).json({
                message: 'Account not found',
            });
        }

        // Створення нового викладача
        const teacher = new Teacher({
            account: accountId,
            name,
            courses, // Масив ID курсів
        });

        // Збереження викладача в базі даних
        await teacher.save();

        res.status(201).json({
            message: 'Teacher added successfully',
            teacher,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add teacher',
        });
    }
};


export const getTeacherById = async (req, res) => {
    try {
        const accountId = req.params.id; // Отримуємо ID акаунта з параметрів запиту

        // Знаходимо викладача за ID акаунта
        const teacher = await Teacher.findOne({ account: accountId })
            .populate('account', 'userName email') // Заповнюємо акаунт, щоб отримати ім'я та email
            .populate('courses', 'course_name group'); // Заповнюємо курси, якщо вони є

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Відправляємо знайдену інформацію про викладача
        res.status(200).json({
            teacherId: teacher._id,
            name: teacher.name,
            account: teacher.account, // Інформація про акаунт
            courses: teacher.courses, // Інформація про курси викладача
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося знайти інформацію про викладача',
        });
    }
};