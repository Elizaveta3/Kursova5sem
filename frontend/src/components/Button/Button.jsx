import React from "react";
import "./Button.css";

export const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  );
};