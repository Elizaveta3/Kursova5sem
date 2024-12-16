import React, { useState, useEffect } from "react";
import {Header} from "../components/Header/Header";
import {useNavigate} from "react-router-dom";
import {TaskCard} from "../components/TaskCard/TaskCard";
import {CourseCard} from "../components/CourseCard/CourseCard.jsx";
import {useSelector} from "react-redux";

export const TasksTeacher = () => {
    const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.userInfo);
  const [teacherData, setTeacherData] = useState(null);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const accountId = currentUser?._id; // Отримуємо ID поточного користувача
        console.log(accountId)
        if (!accountId) return;

        const response = await fetch(`/api/users/getTasks/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(
              `Error fetching teacher data: ${response.statusText}`
          );
        }

        const data = await response.json();
        setTeacherData(data); // Зберігаємо отримані дані в стані
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    fetchTeacherData();
  }, [currentUser?._id]);
    // const handleAllCourseClick = () => {
    //     navigate("/coursesTeacher");
    // };
    //
    // const handleEnter = () => {
    //     navigate("/enter");
    // };

    return (
        <>
            <div className="wrapper">
                <Header/>
                <main className="page">
                    <div className="page__main-block main-block">
                        <div className="main-block__container _container">
                            <h1 className="main-block__title">Оберіть завдання:</h1>
                            <div className="main-block__cards">
                                <TaskCard
                                    taskName="Створення архітектури програмного забезпечення"
                                    onNavigate={() => handleNavigate(1)}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
