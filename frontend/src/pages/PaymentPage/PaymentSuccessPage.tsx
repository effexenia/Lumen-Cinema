import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}> Оплата пройшла успішно!</h1>
        <p className={styles.message}>Дякуємо за покупку квитків у LumenCinema</p>
        <button className={styles.button} onClick={() => navigate('/')}>
          На головну
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
