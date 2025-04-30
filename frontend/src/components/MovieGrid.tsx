import React, { useEffect, useState } from 'react';
import { getAllMovies, getAllGenres } from '../api/api.ts';
import MovieCard from './MovieCard.tsx';
import './MovieGrid.css';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  posterImg: string;
  genres: Genre[];
}

const MovieGrid = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreName, setSelectedGenreName] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      const genreData = await getAllGenres();
      setGenres(genreData);
    };

    const loadMovies = async () => {
      const data = await getAllMovies();
      setMovies(data);
    };

    loadGenres();
    loadMovies();
  }, []);

  const filteredMovies = selectedGenreName
    ? movies.filter(movie =>
        movie.genres.some(genre => genre.name === selectedGenreName)
      )
    : movies;

  return (
    <section className="movie-grid">
      <div className="movie-grid__header">
        <h2>Now Showing</h2>
        <div className="filters">
          <select
            className="filter-dropdown"
            value={selectedGenreName ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedGenreName(value || null);
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="movie-grid__list">
        {filteredMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id} 
          title={movie.title}
          description={movie.description}
          posterImg={movie.posterImg}
          genres={movie.genres || []}
        />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
