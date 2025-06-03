// services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

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

export const createMovie = async (movieData: any) => {
  const response = await axios.post(`${API_URL}/movies`, movieData, authHeader());
  return response.data;
};

export const updateMovie = async (id: number, movieData: any) => {
  const response = await axios.put(`${API_URL}/movies/${id}`, movieData, authHeader());
  return response.data;
};

export const deleteMovie = async (id: number) => {
  const response = await axios.delete(`${API_URL}/movies/${id}`, authHeader());
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
