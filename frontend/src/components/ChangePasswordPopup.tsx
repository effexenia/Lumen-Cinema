import React, { useState } from 'react';
import styles from './ChangePasswordPopup.module.css';
import axios from 'axios';

interface Props {
  onClose: () => void;
  userId: number;
}

const ChangePasswordPopup: React.FC<Props> = ({ onClose, userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необхідно увійти в систему');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/auth/password',
        {
          currentPassword,  // <- Исправлено с oldPassword на currentPassword
          newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Пароль змінено успішно');
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Невірний поточний пароль');
        } else {
          setError('Помилка сервера: ' + error.response?.status);
        }
      } else {
        setError('Невідома помилка');
      }
      console.error('Помилка зміни пароля:', error);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <h3>Змінити пароль</h3>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="password"
          placeholder="Поточний пароль"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Новий пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Підтвердіть новий пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className={styles.buttons}>
          <button onClick={handleSubmit}>Змінити</button>
          <button onClick={onClose}>Скасувати</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;