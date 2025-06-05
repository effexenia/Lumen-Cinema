import React, { useEffect, useState } from 'react';
import {
  getAllMovies,
  getAllGenres,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../api/api.ts';
import EditModal from '../../components/EditModal.tsx';
import { Movie } from '../../models/IMovie';
import { Genre } from '../../models/IMovie';

export const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  

  useEffect(() => {
    getAllMovies().then(setMovies);
    getAllGenres().then(setGenres);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteMovie(id);
    setMovies(movies.filter(u => u.id !== id));
  };

  const handleSave = async (data: any) => {
    if (isAdding) {
      const newMovie = await createMovie(data);
      setMovies([...movies, newMovie]);
      setIsAdding(false);
    } else if (editingMovie) {
      const updated = await updateMovie(editingMovie.id, data);
      setMovies(movies.map(m => m.id === editingMovie.id ? updated : m));
      setEditingMovie(null);
    }
  };

  return (
    <div>
      <h2>Фільми</h2>
      <button onClick={() => setIsAdding(true)}>+ Додати фільм</button>

      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Жанри</th>
            <th>Мова</th>
            <th>Країна</th>
            <th>Дата релізу</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.genres.map(g => g.name).join(', ')}</td>
              <td>{movie.language}</td>
              <td>{movie.country}</td>
              <td>{movie.release_date}</td>
              <td>
                <button onClick={() => setEditingMovie(movie)}>Редагувати</button>
                <button onClick={() => handleDelete(movie.id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editingMovie || isAdding) && (
        <EditModal
          title={isAdding ? 'Додавання фільму' : 'Редагування фільму'}
          initialData={editingMovie || {
            title: '',
            posterImg: '',
            bannerImg: '',
            genres: [],
            description: '',
            summary: '',
            language: '',
            release_date: '',
            country: '',
            studio: '',
            showtimes: [],
            duration_minutes: 0,
            trailerUrl: '',
            averageRating: null
          }}
          fields={[
            { name: 'title', label: 'Назва' },
            { name: 'posterImg', label: 'Постер (URL)' },
            { name: 'bannerImg', label: 'Банер (URL)' },
            { name: 'language', label: 'Мова' },
            { name: 'release_date', label: 'Дата релізу', type: 'date' as const },
            { name: 'duration_minutes', label: 'Тривалість (хв)', type: 'number' },
            { name: 'country', label: 'Країна' },
            { name: 'studio', label: 'Студія' },
            { name: 'trailerUrl', label: 'Трейлер (YouTube)' },
            { name: 'description', label: 'Опис' },
            { name: 'summary', label: 'Короткий опис' },
            // жанри можна зробити окремим селектором у EditModal
          ]}
          onClose={() => {
            setEditingMovie(null);
            setIsAdding(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
