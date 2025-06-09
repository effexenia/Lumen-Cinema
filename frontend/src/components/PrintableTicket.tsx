import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PrintLayoutProps {
  ticket: {
    ticket_id: number;
    movie: string;
    hall: string;
    start_time: string;
    seat_row: number;
    seat_col: number;
    price: number;
  };
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '2px solid #000',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>LUMEN CINEMA</h1>
        <p style={{ margin: '5px 0' }}>📍 Харків, Французький Бульвар</p>
      </header>

      <main>
        <h2 style={{ textAlign: 'center', margin: '10px 0' }}>{ticket.movie}</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Дата та час:</span>
            <span>{formatDate(ticket.start_time)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Зал:</span>
            <span>{ticket.hall}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Місце:</span>
            <span>Ряд {ticket.seat_row}, Місце {ticket.seat_col}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Ціна:</span>
            <span>{ticket.price} грн</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <QRCodeSVG 
            value={`ticket:${ticket.ticket_id}`}
            size={150}
            level="H"
          />
          <p style={{ marginTop: '10px' }}>Пред'явіть цей код на вході</p>
        </div>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <p>Дякуємо за покупку!</p>
        <p>Телефон підтримки: +380 12 345 6789</p>
      </footer>
    </div>
  );
};

export default PrintLayout;