import React from "react";
import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { logout } from "../../slices/authSlice";
import logo from "../../images/logo.svg";
import icon_logout from "../../images/Logout.svg";

export const Header = ({ textButton, firstAction }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/enter");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
      <header className="header">
        <div className="header__container _container">
          <a href="#" className="header__logo">
            <img src={logo} alt="logo" />
          </a>
          <a
              href="#"
              className="header__icon"
              onClick={(e) => {
                e.preventDefault(); // Запобігаємо переходу за посиланням
                logoutHandler(); // Викликаємо обробник виходу
              }}
          >
            <img src={icon_logout} alt="Logout icon" />
          </a>
        </div>
      </header>
  );
};
