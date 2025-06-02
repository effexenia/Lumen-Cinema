// userService.ts
import axios from 'axios';
import { getAuthToken } from './authService.ts';

const API_URL = 'http://localhost:5000/api/auth';

interface ProfileData {
  name?: string;
  email?: string;
  avatar_url?: string;
}

export const getProfile = async (id: number) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/profile/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export const checkAdmin = async (id: number) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/admin/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export const updateProfile = async (id: number, data: FormData) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/profile/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


export const deleteUser = async (userId: number) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return response.data;
};