import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const getAllPayments = async () => {
  const token = localStorage.getItem('token'); 
  console.log("Токен из localStorage:", token); 

  const response = await axios.get(`${API_URL}/payments/all`, {
    headers: {
      Authorization: `Bearer ${token}`, 
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
      ticket_ids: ticketIds 
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

export const confirmPayment = async (payment_id: string) => {
  try {
    const response = await axios.post(`${API_URL}/payments/confirm`, {
      payment_id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
};