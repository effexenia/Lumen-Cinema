import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MoviePage.module.css";
import { getMovieById } from "../../api/api.ts";
import { getSessions } from "../../api/api.ts";
import SessionList from "../../components/SessionList.tsx";
import MovieReviews from '../../components/MovieReviews.tsx';
import TrailerButton from '../../components/TrailerButton.tsx';

interface Genre {
  id: number;
  name: string;
}

type Session = {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;
  price: number;
  hall?: {
    id: number;
    name: string;
  };
};

type Movie = {
  id: number;
  title: string;
  posterImg: string;
  bannerImg: string;
  genres: Genre[];
  description: string;
  summary: string;
  language: string;
  release_date: string;
  country: string;
  studio: string;
  showtimes: string[];
  trailer_url?: string; 
  averageRating: number | null;
};

type Params = {
  id: string;
};

const MoviePage: React.FC = () => {
  const { id } = useParams<Params>();
  const movieId = Number(id);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);

  const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "";
    const isFullUrl = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    return isFullUrl ? imageUrl : `http://localhost:5000/${imageUrl}`;
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "Некоректна дата";
    }
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Функция для фильтрации сеансов на сегодня
  const filterTodaySessions = (sessions: Session[]): Session[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  };

  // Функция для группировки сеансов по времени
  const groupSessionsByTime = (sessions: Session[]) => {
    const grouped: { [key: string]: Session[] } = {};
    
    sessions.forEach(session => {
      const time = new Date(session.start_time).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit"
      });
      
      if (!grouped[time]) {
        grouped[time] = [];
      }
      grouped[time].push(session);
    });
    
    return grouped;
  };

  useEffect(() => {
    getMovieById(movieId)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Помилка завантаження фільму:", error);
        setLoading(false);
      });
  }, [movieId]);

  useEffect(() => {
    getSessions().then((data: Session[]) => {
      const filtered = data.filter((s) => s.movie_id === movieId);
      setSessions(filtered);
      
      // Фильтруем сеансы на сегодня
      const todaySessions = filterTodaySessions(filtered);
      setTodaySessions(todaySessions);
    });
  }, [movieId]);

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (!movie) return <div className={styles.loading}>Фільм не знайдено</div>;

  const groupedTodaySessions = groupSessionsByTime(todaySessions);

  return (
    <div className={styles.page}>
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${getFullImageUrl(movie.bannerImg)})` }}
      >
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <div className={styles.left}>
              <h1 className={styles.bannerTitle}>{movie.title}</h1>
              <p className={styles.bannerOriginalTitle}>Original name</p>
              <p className={styles.bannerDescription}>{movie.description}</p>
            </div>

            <div className={styles.right}>
              <span className={styles.showtimesLabel}>Сеанси сьогодні:</span>
              <div className={styles.showtimesList}>
                {todaySessions.length > 0 ? (
                  Object.entries(groupedTodaySessions).map(([time, timeSessions]) => (
                    <div key={time} className={styles.showtimeGroup}>
                      <div className={styles.showtime}>{time}</div>
                      {timeSessions.length > 1 && (
                        <div className={styles.hallInfo}>
                          {timeSessions.map(session => (
                            <span key={session.id} className={styles.hallBadge}>
                              {session.hall?.name || `Зал ${session.hall_id}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noSessions}>
                    <span>Сьогодні сеансів немає</span>
                  </div>
                )}
              </div>
              
              {todaySessions.length > 0 && (
                <div className={styles.sessionStats}>
                  <span>{todaySessions.length} сеанс(ів) сьогодні</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.trailerButtonWrapper}>
          <TrailerButton 
            trailerUrl={movie.trailer_url} 
            buttonClassName={styles.trailerButton}
            modalClassName={styles.trailerModal}
          />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.posterContainer}>
          {movie.averageRating !== null && (
            <div className={styles.ratingWrapper}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span 
                    key={i} 
                    className={i <= Math.round(movie.averageRating || 0) 
                      ? styles.starFilled 
                      : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.ratingNumber}>
                {movie.averageRating.toFixed(1)}
              </span>
            </div>
          )}
          <div className={styles.poster}>
            <img src={getFullImageUrl(movie.posterImg)} alt={movie.title} />
          </div>
        </div>

        <div className={styles.details}>
          <h3 className={styles.sectionTitle}>Яке це кіно</h3>
          <div className={styles.genreTags}>
            {movie.genres?.map((genre) => (
              <span key={genre.id} className={styles.genreBubble}>
                {genre.name}
              </span>
            ))}
          </div>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.description}>{movie.summary}</p>
        </div>

        <div className={styles.infoBox}>
          <div>
            <span>Мова показу</span>
            <div>{movie.language}</div>
          </div>
          <div>
            <span>Прем'єра</span>
            <div>{formatDate(movie.release_date)}</div>
          </div>
          <div>
            <span>Країна</span>
            <div>{movie.country}</div>
          </div>
          <div>
            <span>Студія</span>
            <div>{movie.studio}</div>
          </div>
        </div>
      </div>
      <SessionList sessions={sessions} />
      <MovieReviews movieId={movieId} />
    </div>
  );
};

export default MoviePage;