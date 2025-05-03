import React from "react";
import styles from "./MyTicketsPage.module.css";

const tickets = [
  {
    movie: "ЧАРІВНИЙ ГОДИННИК",
    date: "2 травня",
    time: "17:15 - 18:41",
    cinema: "Cinetech+, 2D",
    location: "Харків, Французький Бульвар",
    seats: [
      { row: 7, seat: 6 },
      { row: 7, seat: 7 },
    ],
    price: 260,
  },
  {
    movie: "БАРБІ",
    date: "5 травня",
    time: "19:00 - 21:00",
    cinema: "Cinetech+, 3D",
    location: "Київ, ТРЦ Гулівер",
    seats: [{ row: 4, seat: 10 }],
    price: 230,
  },
];

export default function MyTicketsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мої квитки</h1>
      <div className={styles.tickets}>
        {tickets.map((ticket, index) => (
          <div key={index} className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <h2 className={styles.movie}>{ticket.movie}</h2>
              <div className={styles.time}>
                {ticket.date}, {ticket.time}
              </div>
              <div className={styles.cinema}>{ticket.cinema}</div>
              <div className={styles.location}>{ticket.location}</div>
            </div>
            <div className={styles.ticketInfo}>
              <div className={styles.seats}>
                Місця:{" "}
                {ticket.seats
                  .map((s) => `${s.row} ряд, ${s.seat} місце`)
                  .join("; ")}
              </div>
              <div className={styles.price}>{ticket.price} грн</div>
            </div>
            <button className={styles.button}>Показати QR-код</button>
          </div>
        ))}
      </div>
    </div>
  );
}
