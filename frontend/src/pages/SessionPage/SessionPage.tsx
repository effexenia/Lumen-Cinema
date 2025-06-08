import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SessionPage.module.css";
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import { getSessionById } from "../../api/sessionService.ts";
import { getHalls } from "../../api/hallService.ts";
import { getMovieById } from "../../api/api.ts";
import { bookTicket } from "../../api/ticketService.ts";
import { getSessionSeats } from "../../api/ticketService.ts";

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

interface Movie {
  id: number;
  title: string;
  posterImg: string;
}

const generateSeatMap = (rows: number, cols: number): number[][] => {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, seatIndex) => seatIndex + 1)
  );
};

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [seatMap, setSeatMap] = useState<number[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [unavailableSeats, setUnavailableSeats] = useState<
  { row: number; seat: number; status: "paid" | "booked" }[]
>([]);



  const toggleSeatSelection = (row: number, seat: number) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.row === row && s.seat === seat);
      return exists
        ? prev.filter((s) => !(s.row === row && s.seat === seat))
        : [...prev, { row, seat }];
    });
  };

  const handleContinueClick = async () => {
    if (!session || selectedSeats.length === 0) {
      alert("Будь ласка, оберіть місця");
      return;
    }

    const userIdStr = localStorage.getItem("userId");
    if (!userIdStr) {
      alert("Будь ласка, увійдіть у систему");
      return;
    }

    try {
      const userId = +userIdStr;
      const response = await bookTicket(session.id, selectedSeats, userId);
      const { ticketIds } = response;

      navigate("/payment", {
        state: {
          movieId: session.movie_id,
          sessionId: session.id,
          selectedSeats,
          totalPrice: selectedSeats.length * session.price,
          movieTitle: movie?.title || "",
          sessionTime: session.start_time,
          hallName: hall?.name || "",
          posterImg: movie?.posterImg || "",
          ticketIds,
        },
      });
    } catch (error: any) {
      console.error("Помилка бронювання:", error);
      alert(
        error?.response?.data?.message ||
          "Не вдалося забронювати місця. Можливо, деякі вже зайняті."
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const sessionData = await getSessionById(+id);
        setSession(sessionData);

        const allHalls = await getHalls();
        const currentHall = allHalls.find((h) => h.id === sessionData.hall_id);
        setHall(currentHall || null);

        const movieData = await getMovieById(sessionData.movie_id);
        setMovie(movieData);

        if (currentHall) {
          setSeatMap(generateSeatMap(currentHall.seat_rows, currentHall.seat_cols));
        }

        const takenSeats = await getSessionSeats(+id);
        setUnavailableSeats(
          takenSeats.map((s: { seat_row: number; seat_col: number; status: "booked" | "paid" }) => ({
            row: s.seat_row,
            seat: s.seat_col,
            status: s.status
          }))
        );
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
          Фільм: {movie?.title}, {new Date(session.start_time).toLocaleString()}, Зал: {hall.name}
        </span>
      </div>

      <div className={styles.layout}>
        <div className={styles.hall}>
          <div className={styles.screen}>Екран</div>
          <div className={styles.seatMap}>
            {seatMap.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.rowWithNumbers}>
                <div className={styles.rowNumber}>{rowIndex + 1}</div>
                <div className={styles.row}>
                  {row.map((seat) => {
                    const isSelected = selectedSeats.some(
                      (s) => s.row === rowIndex + 1 && s.seat === seat
                    );
                    const seatData = unavailableSeats.find(
                      (s) => s.row === rowIndex + 1 && s.seat === seat
                    );
                    const isPaid = seatData?.status === "paid";
                    const isBooked = seatData?.status === "booked";

                    return (
                      <div
                        key={seat}
                        className={`
                          ${styles.seat}
                          ${isSelected ? styles.selected : ""}
                          ${isPaid ? styles.unavailable : ""}
                          ${isBooked ? styles.booked : ""}
                        `}
                        onClick={() => {
                          if (!isPaid && !isBooked) toggleSeatSelection(rowIndex + 1, seat);
                        }}
                      >
                        {seat}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.rowNumber}>{rowIndex + 1}</div>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <div>
              <span className={`${styles.square} ${styles.selected}`}></span> — Обрано
            </div>
            <div>
              <span className={styles.square}></span> — Вільне ({session.price} грн)
            </div>
            <div>
              <span className={`${styles.square} ${styles.booked}`}></span> — Заброньовано
            </div>
            <div>
              <span className={`${styles.square} ${styles.unavailable}`}></span> — Оплачено
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
                <span>{seat.row} ряд, {seat.seat} місце</span>
                <span>{session.price} грн</span>
              </div>
            ))}
            <div className={styles.total}>
              Всього: {selectedSeats.length} квитки
              <span>{selectedSeats.length * session.price} грн</span>
            </div>
            <button className={styles.button} onClick={handleContinueClick}>
              Продовжити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
  