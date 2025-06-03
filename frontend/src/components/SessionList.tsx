import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SessionList.module.css";

type Session = {
  id: number;
  start_time: string;
  price: number;
};

type Props = {
  sessions: Session[];
};

const getNextDays = (count: number): Date[] => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
};

const SessionList: React.FC<Props> = ({ sessions }) => {
  const navigate = useNavigate();
  const days = getNextDays(7);
  const [selectedDate, setSelectedDate] = useState<string>(
    days[0].toISOString().split("T")[0]
  );

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.start_time)
      .toISOString()
      .split("T")[0];
    return sessionDate === selectedDate;
  });

  const handleSessionClick = (sessionId: number) => {
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Розклад сеансів</h2>

      <div className={styles.dateSelector}>
        {days.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          return (
            <button
              key={dateStr}
              className={`${styles.dateBtn} ${
                selectedDate === dateStr ? styles.active : ""
              }`}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day.toLocaleDateString("uk-UA", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </button>
          );
        })}
      </div>

      <div className={styles.sessions}>
        {filteredSessions.length === 0 && (
          <div className={styles.noSessions}>Сеансів на цю дату немає</div>
        )}

        {filteredSessions.map((session) => (
          <div 
            key={session.id} 
            className={styles.sessionItem}
            onClick={() => handleSessionClick(session.id)}
            style={{ cursor: "pointer" }} 
          >
            <span className={styles.time}>
              {new Date(session.start_time).toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <div className={styles.tooltip}>
                {session.price} ₴
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionList;