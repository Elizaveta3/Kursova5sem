import Teacher from '../../backend/models/teacher.model.js';
import Student from '../../backend/models/student.model.js';

export const getCoursesByAccountIdAndName = async (req, res) => {
    try {
        const { accountId, courseName } = req.params;

        let account = await Teacher.findOne({ account: accountId }).populate('courses');
        if (!account) {
            // Якщо не знайдено серед викладачів, шукаємо серед студентів
            account = await Student.findOne({ account: accountId }).populate('courses');
            if (!account) {
                return res.status(404).json({ message: "Account not found" });
            }
        }

        // Знайти курс серед курсів
        const selectedCourse = account.courses.find(
            (course) => course.course_name === courseName
        );

        if (!selectedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json(selectedCourse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};