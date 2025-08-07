// PrintableTicket.tsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface Ticket {
  ticket_id: number;
  seat_row: number;
  seat_col: number;
  start_time: string;
  movie: string;
  hall: string;
  price: number;
}

interface Props {
  ticket: Ticket;
}

const PrintableTicket: React.FC<Props> = ({ ticket }) => {
  return (
    <div className="ticket">
      <div className="header">
        <h1>LumenCinema</h1>
        <p className="movie">{ticket.movie}</p>
        <p className="datetime">
          {new Date(ticket.start_time).toLocaleString("uk-UA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="details">
        <div className="info">
          <p><strong>Зал:</strong> {ticket.hall}</p>
          <p><strong>Ряд:</strong> {ticket.seat_row}</p>
          <p><strong>Місце:</strong> {ticket.seat_col}</p>
          <p><strong>Ціна:</strong> {ticket.price} грн</p>
          <p><strong>ID квитка:</strong> {ticket.ticket_id}</p>
        </div>
        <div className="qr">
          <QRCodeSVG
            value={`ticket:${ticket.ticket_id}`}
            size={128}
            level="H"
            includeMargin
          />
        </div>
      </div>

      <div className="footer">
        <p>Дякуємо за покупку! Приходьте за 15 хвилин до початку сеансу.</p>
      </div>
    </div>
  );
};

export default PrintableTicket;
