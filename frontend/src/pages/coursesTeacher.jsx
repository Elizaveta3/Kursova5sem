import React, {useState, useEffect} from "react";
import {Header} from "../components/Header/Header";
import {CourseCard} from "../components/CourseCard/CourseCard";
import {useNavigate} from "react-router-dom";
import "../styles/CoursesTeacher.css";
import "../styles/reset.css";

import {useSelector} from "react-redux";

export const CoursesTeacherPage = () => {
    const currentUser = useSelector((state) => state.auth?.userInfo);
    const [teacherData, setTeacherData] = useState(null);
    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const accountId = currentUser?._id; // Отримуємо ID поточного користувача
                console.log(accountId)
                if (!accountId) return;

                const response = await fetch(`/api/users/getTeacher/${accountId}`, {
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
    return (
        <>
            <div className="wrapper">
                <Header/>
                <main className="page">
                    <div className="page__main-block main-block">
                        <div className="main-block__container _container">
                            <h1 className="main-block__title">Оберіть курс:</h1>
                            <div className="main-block__cards">
                                {teacherData?.courses?.length > 0 ? (
                                    teacherData.courses.map((course) => (
                                        <CourseCard key={course._id} course={course}/>
                                    ))
                                ) : (
                                    <p>У вас ще немає створених курсів.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
