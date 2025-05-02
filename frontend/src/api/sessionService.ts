import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getSessions = async (filters?: { movieId?: number; date?: string }) => {
  const response = await axios.get(`${API_URL}/sessions`, { params: filters });
  return response.data;
};

export const getSessionById = async (id: number) => {
  const response = await axios.get(`${API_URL}/sessions/${id}`);
  return response.data;
};

export const createSession = async (sessionData: {
  movie_id: number;
  hall_id: number;
  start_time: string;
  price: number;
}) => {
  const response = await axios.post(`${API_URL}/sessions`, sessionData);
  return response.data;
};

export const updateSession = async (
  id: number,
  sessionData: {
    movie_id: number;
    hall_id: number;
    start_time: string;
    price: number;
  }
) => {
  const response = await axios.put(`${API_URL}/sessions/${id}`, sessionData);
  return response.data;
};

export const deleteSession = async (id: number) => {
  const response = await axios.delete(`${API_URL}/sessions/${id}`);
  return response.data;
};