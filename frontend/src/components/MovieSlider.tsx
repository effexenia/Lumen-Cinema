import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../api/api.ts';
import './MovieSlider.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  bannerImg: string; // для баннера большая картинка
  posterImg: string; // для постера
}

const MovieSlider: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Проверка, чтобы избежать ошибки, если posterImg или bannerImg не определены
  const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return ''; // Если URL не существует, возвращаем пустую строку
    const isFullUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
    return isFullUrl ? imageUrl : `http://localhost:5000/${imageUrl}`;
  };

  useEffect(() => {
    const loadMovies = async () => {
      const data = await getAllMovies();
      setMovies(data);
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % movies.length);
    }, 15000); // каждые 5 секунд смена

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[currentIndex];

  return (
    <section className="movie-slider" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getFullImageUrl(movie.bannerImg)})` }}>
      <div className="movie-slider__content">
        <div className="movie-slider__info">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <div className="movie-slider__buttons">
            <button className="btn-primary">Book tickets</button>
            <button className="btn-secondary">▶ Watch trailer</button>
          </div>
        </div>
        <img src={getFullImageUrl(movie.posterImg)} alt={movie.title} className="movie-slider__poster" />
      </div>
      <div className="movie-slider__dots">
        {movies.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieSlider;
