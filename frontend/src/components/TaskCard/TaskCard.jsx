import React from "react";
import PropTypes from "prop-types";
import "./TaskCard.css";

export const TaskCard = ({ taskName, onNavigate }) => {
    return (
        <div className="task-card">
            <div className="task-card__content">
                <span className="task-card__title">{taskName}</span>
                <button className="task-card__button" onClick={onNavigate}>
                    Перейти
                </button>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    taskName: PropTypes.string.isRequired, // Назва завдання
    onNavigate: PropTypes.func.isRequired, // Функція для переходу до завдання
};