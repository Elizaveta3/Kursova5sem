import React from "react";
import { Header } from "../components/Header/Header";
import { useNavigate } from "react-router-dom";

export const OneCourseTeacher = () => {
  const navigate = useNavigate();

  const handleAllCourseClick = () => {
    navigate("/coursesTeacher");
  };

  const handleEnter = () => {
    navigate("/enter");
  };

  return <>
   <Header 
        textButton="Всі курси" 
        logoutText="Вийти" 
        firstAction={handleAllCourseClick} 
        secondAction={handleEnter} 
      />
  </>;
};
