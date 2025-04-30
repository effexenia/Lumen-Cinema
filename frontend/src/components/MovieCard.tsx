import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

interface Genre {
  id: number;
  name: string;
}

interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  posterImg: string;
  genres: Genre[];
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  description,
  posterImg,
  genres,
}) => {
  const navigate = useNavigate();
  const isFullUrl = posterImg.startsWith('http://') || posterImg.startsWith('https://');
  const fullPosterUrl = isFullUrl ? posterImg : `http://localhost:5000/${posterImg}`;

  const handleClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={fullPosterUrl} alt={title} className="movie-card__image" />
      <div className="movie-card__info">
        <p>{genres.map((genre) => genre.name).join(' • ')}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
