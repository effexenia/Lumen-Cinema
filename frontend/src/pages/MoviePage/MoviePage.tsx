import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MoviePage.module.css";
import { getMovieById } from "../../api/api.ts";
import { getSessions } from "../../api/api.ts";
import SessionList from "../../components/SessionList.tsx";
import MovieReviews from '../../components/MovieReviews.tsx';


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
  trailerUrl?: string; // <-- нове
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
    });
  }, [movieId]);

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (!movie) return <div className={styles.loading}>Фільм не знайдено</div>;

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
        <p className={styles.bannerOriginalTitle}>The Legend of Ochi</p>
        <p className={styles.bannerDescription}>{movie.description}</p>
      </div>

      <div className={styles.right}>
  <span className={styles.showtimesLabel}>Сеанси сьогодні:</span>
  <div className={styles.showtimesList}>
    {sessions.length > 0 ? (
      sessions.map((session) => (
        <div key={session.id} className={styles.showtime}>
          {new Date(session.start_time).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ))
    ) : (
      <span>Немає інформації</span>
    )}
  </div>
</div>
    </div>
  </div>

  <div className={styles.trailerButtonWrapper}>
  <button
    className={styles.trailerButton}
    onClick={() => {
      if (movie?.trailerUrl) {
        window.open(movie.trailerUrl, "_blank");
      } else {
        alert("Трейлер недоступний");
      }
    }}
  >
    &#x23F5; Watch Trailer
  </button>
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
