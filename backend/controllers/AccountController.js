import Account from '../../backend/models/account.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Контролер для реєстрації
export const register = async (req, res) => {
    try {
        const { email, password, userName, role } = req.body;

        // Перевірка ролі
        if (!['teacher', 'student'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid role. Allowed values are teacher or student.',
            });
        }

        // Хешування паролю
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Створення нового користувача
        const doc = new Account({
            email,
            password: hash, // Збереження хешованого паролю
            userName,
            role,
        });

        const account = await doc.save();

        // Генерація токена
        const token = jwt.sign(
            { _id: account._id, role: account.role }, // Додаємо роль у токен
            'secret123',
            { expiresIn: '30d' }
        );

        const { password: _, ...accountData } = account._doc; // Вилучаємо пароль із відповіді

        res.json({ ...accountData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};


export const login = async (req, res) => {
    try {
        const account = await Account.findOne({
            email: req.body.email,
        });

        if (!account) {
            return res.status(404).json({
                message: 'No user found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, account.password);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Incorrect login or password',
            });
        }

        // Генерація токена
        const token = jwt.sign({
            _id: account._id,
            role: account.role, // Додаємо роль до токена
        },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { password: _, ...accountData } = account._doc;

        // Повертаємо дані користувача та токен, включаючи роль
        res.json({
            ...accountData,
            token,
            role: account.role, // Додаємо роль до відповіді
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
};

export const logout = async (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
