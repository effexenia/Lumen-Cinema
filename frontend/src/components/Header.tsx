import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import loginIcon from '../assets/in.png';
import logoutIcon from '../assets/out.png';
import { Search } from './Search.tsx';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };

    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);

    window.dispatchEvent(new Event('authChange'));

    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <NavLink to="/" className="header__logo">
          <img src={logo} alt="Lumien Cinema" />
        </NavLink>

        {/* Navigation */}
        <nav className="header__nav">
          {isLoggedIn && user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? 'header__link active' : 'header__link')}
            >
              Адмін
            </NavLink>
          )}
          <NavLink to="/" className={({ isActive }) => (isActive ? 'header__link active' : 'header__link')}>
            Головна
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'header__link active' : 'header__link')}>
            Про кінотеатр
          </NavLink>
          <NavLink to="/tickets" className={({ isActive }) => (isActive ? 'header__link active' : 'header__link')}>
            Мої квитки
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'header__link active' : 'header__link')}>
            Кабінет
          </NavLink>
        </nav>

        {/* Search */}
        {/* <div className="header__search">
          <input type="text" placeholder="Search..." />
        </div> */}
        <div className="header__search">
          <Search />
        </div>

        {/* Auth Section */}
        <div className="header__auth">
          {isLoggedIn ? (
            <>
              <NavLink
                to={user?.role === 'admin' ? '/admin/dashboard' : '/profile'}
                className="header__user-profile"
              ></NavLink>
              <button onClick={handleLogout} className="header__logout-btn">
                <img src={logoutIcon} alt="Logout" className="header__logout-icon" />
              </button>
            </>
          ) : (
            <NavLink to="/login" className="header__logout-btn">
              <img src={loginIcon} alt="Login" className="header__login-icon" />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
