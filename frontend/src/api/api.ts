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

export const getUserById = async (id: number) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
}
