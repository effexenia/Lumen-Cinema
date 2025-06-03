import React, { useEffect, useState } from 'react';
import { getAllPayments, getPaymentStatus } from '../../api/paymentService.ts';
import { Payment } from '../../models/IPayment.ts';

export const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getAllPayments().then(setPayments);
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <table>
        <thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.ticket_id}</td>
              <td>{payment.amount} ₴</td>
              <td>{payment.status}</td>
              <td>{new Date(payment.payment_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
