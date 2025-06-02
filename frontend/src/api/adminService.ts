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
