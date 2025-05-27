import React, { useEffect, useState } from "react";
import styles from "./MyTicketsPage.module.css";
import { getMyTickets } from "../../api/ticketService.ts";

interface Ticket {
  ticket_id: number;
  seat_row: number;
  seat_col: number;
  start_time: string;
  movie: string;
  hall: string;
  price: number;
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Помилка при отриманні квитків:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div className={styles.page}>Завантаження квитків...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мої квитки</h1>
      <div className={styles.tickets}>
        {tickets.length === 0 ? (
          <div className={styles.noTickets}>У вас ще немає квитків.</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.ticket_id} className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <h2 className={styles.movie}>{ticket.movie}</h2>
                <div className={styles.time}>
                  {new Date(ticket.start_time).toLocaleString("uk-UA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <div className={styles.cinema}>{ticket.hall}</div>
                <div className={styles.location}>Локація: уточнюється</div>
              </div>
              <div className={styles.ticketInfo}>
                <div className={styles.seats}>
                  Місце: {ticket.seat_row} ряд, {ticket.seat_col} місце
                </div>
                <div className={styles.price}>Ціна: {ticket.price} грн</div>
              </div>
              <button className={styles.button}>Показати QR-код</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
