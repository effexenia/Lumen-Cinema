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
