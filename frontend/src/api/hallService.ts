import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getHalls = async () => {
  const response = await axios.get(`${API_URL}/halls`);
  return response.data;
};

export const createHall = async (hallData: { name: string; seat_rows: number; seat_cols: number }) => { 
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/halls`, hallData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateHall = async (id: number, hallData: { name: string; seat_rows: number; seat_cols: number }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/halls/${id}`, hallData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteHall = async (id: number) => {
   const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/halls/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
