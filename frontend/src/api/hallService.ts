import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getHalls = async () => {
  const response = await axios.get(`${API_URL}/halls`);
  return response.data;
};

export const createHall = async (hallData: { name: string; seats: number }) => {
  const response = await axios.post(`${API_URL}/halls`, hallData);
  return response.data;
};

export const updateHall = async (id: number, hallData: { name: string; seats: number }) => {
  const response = await axios.put(`${API_URL}/halls/${id}`, hallData);
  return response.data;
};

export const deleteHall = async (id: number) => {
  const response = await axios.delete(`${API_URL}/halls/${id}`);
  return response.data;
};
