import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css';
import { createPayment, getLiqpayForm } from '../../api/paymentService.ts';

interface PaymentData {
  movieId: number;
  sessionId: number;
  selectedSeats: { row: number; seat: number }[];
  totalPrice: number;
  movieTitle: string;
  sessionTime: string;
  hallName: string;
  posterImg: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

    const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "";
    const isFullUrl = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    return isFullUrl ? imageUrl : `http://localhost:5000/${imageUrl}`;
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }
    setPaymentData(location.state as PaymentData);
  }, [location, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

const handlePaymentSubmit = async () => {
  if (!paymentData || isProcessing) return;

  setIsProcessing(true);

  try {
    // Емуляція ticketIds
    const ticketIds = paymentData.selectedSeats.map((_, index) => Date.now() + index);

    const { data, signature } = await getLiqpayForm(ticketIds, paymentData.totalPrice);

    // Створюємо форму для перенаправлення на LiqPay
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.liqpay.ua/api/3/checkout';
    form.innerHTML = `
      <input type="hidden" name="data" value="${data}" />
      <input type="hidden" name="signature" value="${signature}" />
    `;
    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error('Помилка при оплаті:', error);
    alert('Не вдалося ініціювати оплату');
    setIsProcessing(false);
  }
};


  if (!paymentData) {
    return <div className={styles.loading}>Завантаження даних...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('uk-UA', { month: 'long' });
    const time = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    return `${day} ${month}, ${time}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.backArrow} onClick={handleBackClick}>←</span>
          <div>
            <div className={styles.step}>Оформлення квитків <strong>4</strong> / 4</div>
            <div className={styles.subStep}>Оплата</div>
          </div>
        </div>

        <div className={styles.content}>
          <img src={getFullImageUrl(paymentData.posterImg)} alt={paymentData.movieTitle} className={styles.poster} />
          
          <div className={styles.details}>
            <h1 className={styles.title}>{paymentData.movieTitle.toUpperCase()}</h1>
            <div className={styles.location}>📍 Харків, Французький Бульвар</div>
            <div className={styles.session}>
              {formatDate(paymentData.sessionTime)}, {paymentData.hallName}
            </div>

            <div className={styles.summary}>
              Всього: <strong>{paymentData.selectedSeats.length} квитки</strong> на суму –{' '}
              <strong>{paymentData.totalPrice} грн</strong>
            </div>

            <div className={styles.paymentLabel}>Оплата зручним для тебе способом</div>

            <div className={styles.paymentMethod}>
              <span className={styles.radio}></span>
              <span>Оплатити карткою</span>
              <div className={styles.icons}>
                <img src="/icons/gpay.svg" alt="Google Pay" />
                <img src="/icons/visa.svg" alt="Visa" />
                <img src="/icons/mastercard.svg" alt="Mastercard" />
                <img src="/icons/privat.svg" alt="Privat" />
              </div>
            </div>

            <button 
              className={styles.confirmButton}
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? 'Обробка оплати...' : 'Підтвердити й оплатити'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;