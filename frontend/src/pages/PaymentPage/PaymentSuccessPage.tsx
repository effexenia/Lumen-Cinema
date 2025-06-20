import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(true);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const updateTickets = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const session_id = searchParams.get('session_id');
        const seats = searchParams.get('seats');

        if (!session_id || !seats) {
          throw new Error('Missing payment data');
        }

        // 1. Оновлюємо статус квитків
        const ticketRes = await fetch('http://localhost:5000/api/tickets/update-ticket-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id,
            selectedSeats: JSON.parse(decodeURIComponent(seats))
          }),
        });

        if (!ticketRes.ok) {
          const errorData = await ticketRes.json();
          throw new Error(errorData.message || 'Update failed');
        }

        // 2. Підтверджуємо оплату (оновлюємо статус у таблиці payments)
        const paymentRes = await fetch('http://localhost:5000/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id }),
        });

        if (!paymentRes.ok) {
          const errorData = await paymentRes.json();
          throw new Error(errorData.message || 'Payment confirmation failed');
        }

        setIsUpdating(false);
      } catch (error) {
        console.error('Update error:', error);
        setUpdateError(error.message);
        setIsUpdating(false);
      }
    };

    updateTickets();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {isUpdating ? (
          <div className={styles.loading}>Оновлення статусу квитків...</div>
        ) : updateError ? (
          <>
            <h1 className={styles.errorTitle}>Помилка оновлення</h1>
            <p className={styles.errorMessage}>{updateError}</p>
            <p>Будь ласка, зверніться до підтримки з номером замовлення</p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Оплата успішна!</h1>
            <p className={styles.message}>Ваші квитки успішно оплачені</p>
          </>
        )}
        
        <button 
          className={styles.button} 
          onClick={() => navigate('/')}
          disabled={isUpdating}
        >
          На головну
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
