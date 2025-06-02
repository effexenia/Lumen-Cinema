import React, { useState } from 'react';
import styles from './LoginPopup.module.css';
import authService from '../../api/authService.ts';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPopup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await authService.login({ email, password });
        
        // Сохраняем данные единообразно:
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id.toString()); 
        localStorage.setItem('userRole', response.user.role);
        
        // Для остальных данных можно сохранить объект (опционально)
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      } catch (error: any) {
        alert(error.response?.data?.message || 'Login failed');
      }
    };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>⚡</div>
          <span className={styles.logoText}>LUMEN</span>
        </div>

        <h2 className={styles.welcomeTitle}>Welcome back!</h2>
        <p className={styles.welcomeSubtitle}>Please login to your account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username/Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jabber@gmail.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
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

          <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#/" className={styles.forgotLink}>Forgot password?</a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login to Lumen →
          </button>
        </form>

        <p className={styles.footerText}>
          Don’t have an account yet?{' '}
          <a href="/register" className={styles.createAccount}>Create a Lumen account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;

