import React, { useEffect, useState } from 'react';
import {
  getAllMovies,
  getAllGenres,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../api/api.ts';
import EditModal from '../../components/EditModal.tsx';
import { Movie, Genre } from '../../models/IMovie';

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
    setMovies(prev => prev.filter(movie => movie.id !== id));
  };

const handleSave = async (data: any) => {
  data.genres = data.genres?.map((id: string | number) => Number(id));

  if (isAdding) {
    const newMovie = await createMovie(data);
    // Можно просто добавить новый фильм в стейт
    setMovies(prev => [...prev, newMovie]);
    setIsAdding(false);
  } else if (editingMovie) {
    await updateMovie(editingMovie.id, data);
    // После обновления получаем свежие данные с сервера
    const freshMovies = await getAllMovies();
    setMovies(freshMovies);
    setEditingMovie(null);
  }
};


const getInitialData = (): any => {
  if (editingMovie) {
    const formattedDate = editingMovie.release_date
      ? new Date(editingMovie.release_date).toISOString().split('T')[0]
      : '';

    return {
      ...editingMovie,
      release_date: formattedDate,
      genres: editingMovie.genres?.map(g => g.id) || [],
    };
  }
  return {
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
    averageRating: null,
  };
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
              <td>{Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : ''}</td>
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
        key={editingMovie?.id || 'new'}
          title={isAdding ? 'Додавання фільму' : 'Редагування фільму'}
          initialData={getInitialData()}
          fields={[
            { name: 'title', label: 'Назва', required: true },
            { name: 'posterImg', label: 'Постер (URL)' },
            { name: 'bannerImg', label: 'Банер (URL)' },
            { name: 'language', label: 'Мова' },
            { name: 'release_date', label: 'Дата релізу', type: 'date' },
            { name: 'duration_minutes', label: 'Тривалість (хв)', type: 'number' },
            { name: 'country', label: 'Країна' },
            { name: 'studio', label: 'Студія' },
            { name: 'trailerUrl', label: 'Трейлер (YouTube)' },
            { name: 'description', label: 'Опис' },
            { name: 'summary', label: 'Короткий опис' },
            {
              name: 'genres',
              label: 'Жанри',
              type: 'select',
              options: genres.map(g => ({ value: g.id, label: g.name })),
              required: true
            }
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
