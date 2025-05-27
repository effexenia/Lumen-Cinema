import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getMyTickets = async () => {
  const response = await axios.get(`${API_URL}/tickets/my`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const bookTickets = async (sessionId: number, seats: {row: number, seat: number}[], userId: number) => {
  const response = await axios.post(`${API_URL}/tickets/book`, {
    session_id: sessionId,
    seats,
    user_id: userId
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const cancelTicket = async (ticketId: number) => {
  const response = await axios.delete(`${API_URL}/tickets/${ticketId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getSessionSeats = async (sessionId: number) => {
  const response = await axios.get(`${API_URL}/sessions/${sessionId}/seats`);
  return response.data;
};