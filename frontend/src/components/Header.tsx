import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import loginIcon from '../assets/in.png'; // Иконка для входа
import logoutIcon from '../assets/out.png'; 


export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  return (
    <header className="header">
      <div className="header__container">

        {/* Логотип */}
        <NavLink  to="/" className="header__logo">
        <img src={logo} alt="Lumien Cinema" />
        </NavLink >

        {/* Навігація */}
        <nav className="header__nav">
          <NavLink  to="/" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Home</NavLink >
          <NavLink  to="/about" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>About Us</NavLink >
          <NavLink  to="/tickets" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>My Tickets</NavLink >
          <NavLink  to="/profile" className={({ isActive }) => isActive ? "header__link active" : "header__link"}>Profile</NavLink >
        </nav>

        {/* Пошук */}
        <div className="header__search">
          <input type="text" placeholder="Search..." />
        </div>

       {/* Иконка входа */}
       <div className="header__auth">
        {isLoggedIn ? (
          <div className="header__user-menu">
            <NavLink to={user?.role === 'admin' ? '/admin/dashboard' : '/profile'}>
              <img src={user?.avatar || loginIcon} alt="User" className="header__auth-icon" />
            </NavLink>
            <button onClick={handleLogout} className="header__logout">
              <img src={logoutIcon} alt="Logout" />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="header__login">
            <img src={loginIcon} alt="Login" className="header__auth-icon" />
          </NavLink>
        )}
      </div>
      </div>
    </header>
  );
};
