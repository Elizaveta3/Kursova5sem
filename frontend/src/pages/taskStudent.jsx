import React, {useState, useEffect} from "react";
import {Header} from "../components/Header/Header";
import {useNavigate} from "react-router-dom";
import {TaskAccordion} from "../components/TaskAccordion/TaskAccordion";
import {TaskCard} from "../components/TaskCard/TaskCard.jsx";
import '../styles/taskStudent.css'
import {useSelector} from "react-redux";

export const TaskStudent = () => {
    const currentUser = useSelector((state) => state.auth?.userInfo);
    const selectedCourse = useSelector((state) => state.course.selectedCourse);
    const [tasks, setTasks] = useState([]);
    const [taskGrades, setTaskGrades] = useState({});
    const [error, setError] = useState(null);


    const selectedTask = useSelector((state) => state.task.selectedTask);
    const accountId = currentUser?._id;
    console.log('selectedCourse', selectedCourse?._id)

// Функція для отримання оцінки завдання
    const fetchGrade = async (taskId) => {
        try {
            const response = await fetch(`/api/users/grades/task/${taskId}/student/${accountId}`);
            if (!response.ok) {
                throw new Error("Помилка при отриманні оцінки");
            }
            const data = await response.json();
            return {
                grade: data.grade,  // Store grade
                comment: data.comment  // Store comment
            };
        } catch (err) {
            console.error(err);
            return { grade: null, comment: null }; // Return null if error
        }
    };

    useEffect(() => {
        const loadTasksAndGrades = async () => {
            if (selectedCourse) {
                try {
                    const response = await fetch(`/api/users/getTasks/${selectedCourse._id}`);
                    if (!response.ok) throw new Error("Помилка при отриманні завдань");
                    const data = await response.json();
                    setTasks(data.tasks);

                    // Get grades and comments for each task
                    const grades = {};
                    for (const task of data.tasks) {
                        const gradeData = await fetchGrade(task._id);
                        grades[task._id] = gradeData; // Store both grade and comment
                    }
                    setTaskGrades(grades); // Store them in taskGrades state
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                }
            }
        };

        loadTasksAndGrades();
    }, [selectedCourse, accountId]);


    return (
        <div className="wrapper">
            <Header/>
            <main className="page">
                <div className="page__main-block main-block">
                    <div className="main-block__container _container">
                        <h1 className="main-block__title">Оберіть завдання:</h1>
                        {error ? (
                            <p className="error-message">Помилка: {error}</p>
                        ) : (
                            tasks.map((task) => (
                                <TaskAccordion
                                    key={task._id}
                                    subjectName={task.title}
                                    status={taskGrades[task._id]?.grade ? "Здано" : "Не здано"} // Змінений статус
                                    score={taskGrades[task._id]?.grade || 0}  // Використовуємо grade, якщо він є
                                    comment={taskGrades[task._id]?.comment || "Без коментаря"} // Використовуємо comment, якщо він є
                                />
                            ))
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};
