import React from "react";
import "./CourseBlock.css";

export const CourseBlock = () => {
  return (
    <div className="course-block">
      <div className="course-block-header">
        <p>ТВ-21. Асинхронне програмування</p>
      </div>
      <div className="course-block-footer">
        <button className="icon-button edit-button">✏️</button>
        <button className="icon-button delete-button">🗑️</button>
        <span className="details-text">Детальніше</span>
      </div>
    </div>
  );
};
