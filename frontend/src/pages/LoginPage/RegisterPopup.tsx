import React, { useState } from 'react';
import styles from './LoginPopup.module.css';
import authService from '../../api/authService.ts';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPopup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirm = () => setShowConfirm(prev => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      await authService.register({ name, email, password });
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>✨</div>
          <span className={styles.logoText}>LUMEN</span>
        </div>

        <h2 className={styles.welcomeTitle}>Створити акаунт</h2>
        <p className={styles.welcomeSubtitle}>Заповніть поля для реєстації</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>ПІБ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Електронна пошта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Пароль</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={togglePassword}
                style={{ cursor: 'pointer' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Підтвердити Пароль</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={toggleConfirm}
                style={{ cursor: 'pointer' }}
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <p className={styles.footerText}>
            Вже маєте акаунт?{' '}
            <a href="/login" className={styles.createAccount}>Логін</a>
          </p>

          <button type="submit" className={styles.loginButton}>
            Create Account →
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPopup;
