import React from "react";
import "./Header.css";
import { Button } from "../Button/Button";
import logo from '../../images/LOGO.png'

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/userApiSlice';
import { logout } from '../../slices/authSlice';

export const Header = ({ textButton, firstAction }) => {

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/enter');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="header_main">
      <div className="header_right_block">
        <a href="/" className="header_logo_link">
          <img src={logo} alt="logo" className="header_logo_pic" />
        </a>
        <Button text={textButton} onClick={firstAction} />
      </div>
      <div className="header_left_block">
        <Button text='Вийти' onClick={logoutHandler}  />
      </div>
    </div>
  );
};
