import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin'; 

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getStatistics = async () => {
  const response = await axios.get(`${API_URL}/statistics`, authHeader());
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, authHeader());
  return response.data;
};

export const deleteUserById = async (id: number) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, authHeader());
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users`, userData, authHeader());
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData, authHeader());
  return response.data;
};
