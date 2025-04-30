// services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getAllMovies = async () => {
  const response = await axios.get(`${API_URL}/movies`);
  return response.data;
};

export const getAllGenres = async () => {
  const response = await axios.get(`${API_URL}/genres`);
  return response.data;
};

export const getMovieById = async (id: number) => {
  const response = await axios.get(`${API_URL}/movies/${id}`);
  return response.data;
};

export const getSessions = async () => {
  const response = await axios.get(`${API_URL}/sessions`)
  return response.data;
}

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout
};

export default authService;