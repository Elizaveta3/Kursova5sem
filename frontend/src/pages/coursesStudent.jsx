import React, {useState, useEffect} from "react";
import {Header} from "../components/Header/Header";
import {CourseCard} from "../components/CourseCard/CourseCard";
import {useNavigate} from "react-router-dom";
import "../styles/CoursesTeacher.css";
import "../styles/reset.css";

import {useSelector} from "react-redux";

export const CoursesStudentPage = () => {
  const currentUser = useSelector((state) => state.auth?.userInfo);
  const [studentData, setStudentData] = useState(null);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const accountId = currentUser?._id; // Отримуємо ID поточного користувача
        console.log(accountId)
        if (!accountId) return;

        const response = await fetch(`/api/users/getStudent/${accountId}`, {
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
        setStudentData(data); // Зберігаємо отримані дані в стані
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    fetchStudentData();
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
                  {studentData?.courses?.length > 0 ? (
                      studentData.courses.map((course) => (
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
