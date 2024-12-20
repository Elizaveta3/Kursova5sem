import React, { useState, useEffect } from "react";
import {Header} from "../components/Header/Header";
import {useNavigate} from "react-router-dom";
import {TaskCard} from "../components/TaskCard/TaskCard";
import {CourseCard} from "../components/CourseCard/CourseCard.jsx";
import {useSelector} from "react-redux";
import { useDispatch } from 'react-redux';
// import '../styles/tasksTeacher.css'
import { setSelectedTask } from '../slices/taskSlice';

export const TasksTeacher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state) => state.course.selectedCourse);
    const [tasks, setTasks] = useState([]); // Стан для завдань
    const [students, setStudents] = useState([]); // Стан для студентів

    useEffect(() => {
        if (selectedCourse) {
            // Запит для отримання завдань
            fetch(`/api/users/getTasks/${selectedCourse._id}`)
                .then((response) => response.json())
                .then((data) => setTasks(data.tasks))
                .catch((error) => console.error("Error fetching tasks:", error));

            // Запит для отримання студентів
            /*fetch(`/api/courses/${selectedCourse._id}/students`)
              .then((response) => response.json())
              .then((data) => setStudents(data.students))
              .catch((error) => console.error("Error fetching students:", error));*/
        }
    }, [selectedCourse]);
    // const handleAllCourseClick = () => {
    //     navigate("/coursesTeacher");
    // };
    //
    // const handleEnter = () => {
    //     navigate("/enter");
    // };

    const handleTaskClick = (taskId) => {
        const task = tasks.find((task) => task._id === taskId);
        if (task) {
            dispatch(setSelectedTask(task)); // Викликаємо екшн для збереження завдання в Redux
            navigate("/taskTeacher"); // Перехід на сторінку з відкриттям завдання
        }
    };
    return (
        <div className="wrapper">
            <Header />
            <main className="page">
                <div className="page__main-block main-block">
                    <div className="main-block__container _container">

                        <h1 className="main-block__title">Оберіть завдання:</h1>

                        {selectedCourse ? (
                            tasks.length > 0 ? (
                                <div className="main-block__cards">
                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            taskName={task.title}
                                            onNavigate={() => handleTaskClick(task._id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>Завдань немає.</p>
                            )
                        ) : (
                            <p>Курс не вибрано.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
