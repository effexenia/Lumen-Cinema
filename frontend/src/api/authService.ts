import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getAuthToken = (): string => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };
  
  export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };
  
  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  };
  
  const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { user, token } = response.data;
  
    if (token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
  
    return { user, token };
  };
  
  const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem('user');
  };
  const authService = {
    register,
    login,
    logout,
  };
  
  export default authService;