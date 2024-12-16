import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';


import {  AccountController,
    GroupController,
    CourseController,
    TeacherController,
    TaskController,
    StudentController,
    GradeController,
} from './controllers/index.js'

dotenv.config();

const app = express();

app.use(express.json());

app.post('/api/users/auth', AccountController.login);
app.post('/api/users/register', AccountController.register);
app.post('/api/users/logout', AccountController.logout);

app.get("/api/users/getGroups", GroupController.getGroups);

app.get("/api/users/getTeacher/:id", TeacherController.getTeacherById)
app.get("/api/users/courses/:accountId/:courseName", CourseController.getCoursesByAccountIdAndName);

//student
app.post("/api/users/addStudent", StudentController.addStudent);
app.get("/api/users/getStudent/:id", StudentController.getStudentByAccountId)

app.get("/api/users/getTasks/:courseId", TaskController.getTasksByCourse )

//оцінки
// Додавання оцінки для завдання
app.post('/api/users/tasks/:taskId/grades', GradeController.addGrade);

// Отримання всіх оцінок для завдання
app.get('/api/users/tasks/:taskId/grades', GradeController.getGradesByTask);

app.get("/", (req,res) => {
    res.send("Server is ready");
})

app.listen(8086, () => {
    connectDB();
    console.log("Server started");
});