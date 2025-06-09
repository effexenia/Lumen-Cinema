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
export const createPayment = async (
  ticketIds: number[], 
  amount: number,
  sessionId: number,
  selectedSeats: { row: number; seat: number }[]
) => {
  try {
    const response = await axios.post(`${API_URL}/payments/stripe-session`, {
      amount: amount,
      session_id: sessionId,
      selectedSeats: selectedSeats,
      ticket_ids: ticketIds // дополнительно отправляем ID билетов, если они нужны
    }, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
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