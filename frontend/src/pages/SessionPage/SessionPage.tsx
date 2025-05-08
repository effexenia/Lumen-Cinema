import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SessionPage.module.css";
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getSessionById } from "../../api/sessionService.ts";
import { getHalls } from "../../api/hallService.ts";
import { getMovieById } from "../../api/api.ts";

interface Seat {
  row: number;
  seat: number;
}

interface Session {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;
  price: number;
}

interface Hall {
  id: number;
  name: string;
  seat_rows: number;
  seat_cols: number;
}

type Movie = {
  id: number;
  title: string;
  posterImg: string;
};

const generateSeatMap = (rows: number, cols: number): number[][] => {
  const seatMap: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(j + 1); // або row.unshift(j + 1) для відображення справа наліво
    }
    seatMap.push(row);
  }
  return seatMap;
};


export default function SessionPage() {
  const { id } = useParams(); // get session ID from route
  const [session, setSession] = useState<Session | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [seatMap, setSeatMap] = useState<number[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
const handleContinueClick = () => {
    if (!session || !session.price) {
    console.error("Session data is not loaded");
    return;
  }
  if (selectedSeats.length === 0) {
    alert("Будь ласка, оберіть хоча б одне місце");
    return;
  }

  navigate("/payment", {
    state: {
      movieId: session?.movie_id,
      sessionId: session?.id,
      selectedSeats,
      totalPrice: selectedSeats.length * session?.price,
      movieTitle: movie?.title,
      sessionTime: session?.start_time,
      hallName: hall?.name,
      posterImg: movie?.posterImg
    }
  });
};
  
  const toggleSeatSelection = (row: number, seat: number) => {
  const seatIndex = selectedSeats.findIndex(s => s.row === row && s.seat === seat);
  if (seatIndex !== -1) {
    // Видалити місце з вибраних
    setSelectedSeats(prev => prev.filter((_, i) => i !== seatIndex));
  } else {
    // Додати місце
    setSelectedSeats(prev => [...prev, { row, seat }]);
  }
};

  useEffect(() => {
const fetchData = async () => {
  try {
    if (!id) return;
    const sessionData = await getSessionById(+id);
    setSession(sessionData);

    const allHalls = await getHalls();
    const currentHall = allHalls.find((h: Hall) => h.id === sessionData.hall_id);
    setHall(currentHall);

    const movieData = await getMovieById(sessionData.movie_id);
    setMovie(movieData);

    if (currentHall) {
      const map = generateSeatMap(currentHall.seat_rows, currentHall.seat_cols);
      setSeatMap(map);
    }
  } catch (error) {
    console.error("Помилка при завантаженні даних:", error);
  }
};


    fetchData();
  }, [id]);

  if (!session || !hall) return <div>Завантаження...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Обери місця в залі</h1>
      <div className={styles.subtitle}>
        <span>
          {/* Приклад форматування часу */}
          Фільм: {movie?.title}, {new Date(session.start_time).toLocaleString()}, Зал: {hall.name}
        </span>
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
                      className={`${styles.seat} ${isSelected ? styles.selected : ""}`}
                      onClick={() => toggleSeatSelection(rowIndex + 1, seat)}
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
              <span className={`${styles.square} ${styles.selected}`}></span> — Обрано
            </div>
            <div>
              <span className={styles.square}></span> — {session.price} грн
            </div>
            <div>
              <span className={`${styles.square} ${styles.vip}`}></span> — VIP — {session.price + 100} грн
            </div>
            <div>
              <span className={`${styles.square} ${styles.unavailable}`}></span> — Недоступні
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
                <span>{session.price} грн</span>
              </div>
            ))}
            <div className={styles.total}>
              Всього: {selectedSeats.length} квитки
              <span>{selectedSeats.length * session.price} грн</span>
            </div>
           <button className={styles.button} onClick={handleContinueClick}>Продовжити</button>
          </div>
        </div>
      </div>
    </div>
  );
}
