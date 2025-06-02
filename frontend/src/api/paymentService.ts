import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const getAllPayments = async () => {
  const token = localStorage.getItem('token'); // Проверьте, что токен есть
  console.log("Токен из localStorage:", token); // Убедитесь, что он не `null`

  const response = await axios.get(`${API_URL}/payments/all`, {
    headers: {
      Authorization: `Bearer ${token}`, // Важно: "Bearer " + токен
    },
  });
  return response.data;
};
export const createPayment = async (ticketIds: number[], amount: number) => {
  const response = await axios.post(`${API_URL}/payments`, {
    ticket_ids: ticketIds,
    amount
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getPaymentStatus = async (paymentId: string) => {
  const response = await axios.get(`${API_URL}/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getLiqpayForm = async (ticketIds: number[], amount: number) => {
  const response = await axios.post(`${API_URL}/payments/liqpay`, {
    ticketIds,
    amount,
  });
  return response.data; // { data, signature }
};