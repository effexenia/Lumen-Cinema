import React from "react";
import styles from "./SessionPage.module.css";
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

const seatMap = [
  [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
];

const selectedSeats = [
  { row: 7, seat: 7 },
  { row: 7, seat: 6 },
];

export default function SessionPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Обери місця в залі</h1>
      <div className={styles.subtitle}>
        <span>ЧАРІВНИЙ ГОДИННИК, 2 травня, 17:15 - 18:41, Cinetech+, 2D</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.hall}>
          <div className={styles.screen}>Екран</div>
          <div className={styles.seatMap}>
            {seatMap.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((seat) => {
                  const isSelected = selectedSeats.some(
                    (s) => s.row === rowIndex + 1 && s.seat === seat
                  );
                  return (
                    <div
                      key={seat}
                      className={`${styles.seat} ${
                        isSelected ? styles.selected : ""
                      }`}
                    >
                      {seat}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <div>
              <span className={`${styles.square} ${styles.selected}`}></span> —
              Обрано
            </div>
            <div>
              <span className={styles.square}></span> — 130 грн (3500 бонусів)
            </div>
            <div>
              <span className={`${styles.square} ${styles.vip}`}></span> — VIP
              — 230 грн (5300 бонусів)
            </div>
            <div>
              <span className={`${styles.square} ${styles.unavailable}`}></span>{" "}
              — Недоступні
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.infoRow}>
            <FaMapMarkerAlt /> Харків, Французький Бульвар
          </div>
          <div className={styles.infoRow}>
            <FaInfoCircle /> Можна дивитися глядачам з 12 років
          </div>
          <div className={styles.tickets}>
            {selectedSeats.map((seat, i) => (
              <div key={i} className={styles.ticketRow}>
                <span>
                  {seat.row} ряд, {seat.seat} місце
                </span>
                <span>130 грн</span>
              </div>
            ))}
            <div className={styles.total}>
              Всього: {selectedSeats.length} квитки
              <span>{selectedSeats.length * 130} грн</span>
            </div>
            <button className={styles.button}>Продовжити</button>
          </div>
        </div>
      </div>
    </div>
  );
}
