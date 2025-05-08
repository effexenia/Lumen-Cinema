import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { getProfile, updateProfile, deleteUser  } from '../../api/userService.ts';
import { isAuthenticated } from '../../api/authService.ts';
import ChangePasswordPopup from '../../components/ChangePasswordPopup.tsx';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string | null;
  dob?: string | null;  
  created_at?: string;
  role?: string;  
}
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: '',
    phone: '',
    dob: ''
  });

  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getProfile(userId);
        const userData = response.user; // Извлекаем данные пользователя
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          avatar_url: userData.avatar_url || '',
          phone: userData.phone || '',
          dob: userData.dob || ''
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const getFullAvatarUrl = (avatarUrl?: string) => {
    if (!avatarUrl) return 'http://localhost:5000/uploads/default-avatar.png';
    
    const isFullUrl = avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
    return isFullUrl ? avatarUrl : `http://localhost:5000${avatarUrl}`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


const handleSave = async () => {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('dob', formData.dob);
  data.append('phone', formData.phone);

  if (!selectedFile && formData.avatar_url) {
    data.append('avatar_url', formData.avatar_url);
  }

  if (selectedFile) {
    data.append('avatar', selectedFile);
  }

  try {
    const response = await updateProfile(userId, data); // використовуємо API з userService.ts

    setUser(response.user);
    setFormData(prev => ({
      ...prev,
      avatar_url: response.user.avatar_url || ''
    }));
    setIsEditing(false);
    setSelectedFile(null);
    alert('Профіль оновлено!');
  } catch (error) {
    console.error('Update error:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate('/login');
    } else {
      alert('Помилка при оновленні профілю');
    }
  }
};

  

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token'); // якщо ти зберігаєш токен
    navigate('/login');
  };
  
  const handleDeleteAccount = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити акаунт?')) return;
  
    try {
      await deleteUser(userId);
      localStorage.clear();
      navigate('/register');
    } catch (error) {
      console.error('Помилка при видаленні акаунта:', error);
      alert('Не вдалося видалити акаунт');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  
    // Можна одразу оновити preview
    const tempUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar_url: tempUrl }));
  };
  

  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (!user) return <div className={styles.error}>Не вдалося завантажити дані</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <img
          src={getFullAvatarUrl(user.avatar_url)}
          className={styles.avatar}
          alt="avatar"
        />
        {isEditing && (
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            className={styles.avatarInput}
          />
        )}
        <div className={styles.username}>{user.name || 'Вказати ім’я'}</div>
        <div className={styles.bonus}>Бонусів: 0</div>

        <ul className={styles.menu}>
          <li className={styles.active}>Персональні дані</li>
          <li>Мої платіжні картки</li>
          <li>Моя підписка</li>
          <li>Налаштування сповіщень</li>
        </ul>

        <button className={styles.logout} onClick={handleLogout}>Вийти</button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Персональні дані</h2>
          {isEditing ? (
            <div>
              <button className={styles.saveButton} onClick={handleSave}>Зберегти</button>
              <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Скасувати</button>
            </div>
          ) : (
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>✎ Редагувати</button>
          )}
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoItem}>
            <span>Ім’я</span>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.editInput}
              />
            ) : (
              <span className={!user.name ? styles.placeholder : undefined}>
                {user.name || '—'}
              </span>
            )}
          </div>

          <div className={styles.infoItem}>
            <span>Пошта</span>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.editInput}
              />
            ) : (
              <span className={!user.email ? styles.warning : undefined}>
                {user.email || '⚠ Додавання пошти'}
              </span>
            )}
          </div>

          <div className={styles.infoItem}>
            <span>День народження</span>
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={styles.editInput}
              />
            ) : (
              <span className={!user.dob ? styles.warning : undefined}>
                {user.dob ? formatDate(user.dob) : '⚠ Вказати дату'}
              </span>
            )}
          </div>

          <div className={styles.infoItem}>
            <span>Дата реєстрації</span>
            <span>{user.created_at ? formatDate(user.created_at) : '—'}</span>
          </div>

          <div className={styles.infoItem}>
            <span>Номер телефону</span>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.editInput}
                placeholder="+380 (__) ___ __ __"
              />
            ) : (
              <span>{user.phone || '—'}</span>
            )}
          </div>

          <div className={styles.infoItem}>
          <span>Пароль</span>
          <span>
            ••••••{' '}
            <button className={styles.changePasswordBtn} onClick={() => setShowPasswordPopup(true)}>
              Змінити
            </button>
          </span>
        </div>
        {showPasswordPopup && (
          <ChangePasswordPopup 
            onClose={() => setShowPasswordPopup(false)} 
            userId={user.id} 
          />
        )}

          <div className={styles.deleteAccount} onClick={handleDeleteAccount}> Видалити акаунт</div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;