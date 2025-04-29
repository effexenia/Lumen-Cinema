import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png'

export const Header = () => {
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

      </div>
    </header>
  );
};
