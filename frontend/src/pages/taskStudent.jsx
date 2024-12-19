import React from "react";
import { Header } from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { TaskAccordion } from "../components/TaskAccordion/TaskAccordion";
import {TaskCard} from "../components/TaskCard/TaskCard.jsx";

export const TaskStudent = () => {
  const navigate = useNavigate();

  const handleAllCourseClick = () => {
    navigate("/coursesTeacher");
  };

  const handleEnter = () => {
    navigate("/enter");
  };

  return (
      <div className="wrapper">
        <Header />
        <main className="page">
          <div className="page__main-block main-block">
            <div className="main-block__container _container">
              <h1 className="main-block__title">Оберіть завдання:</h1>
              <TaskAccordion
                  subjectName="Створення архітектури програмного забезпечення"
                  status="Не здано"
                  score={20}
                  comment="Добре виконано, але є незначні помилки."
              />

            </div>
          </div>
        </main>
      </div>
  );
};
