const API_URL = 'http://localhost:5000/api';

export const getAverageRating = async (movieId: number) => {
  const res = await fetch(`${API_URL}/movies/${movieId}/rating`);
  if (!res.ok) throw new Error('Не вдалося отримати середню оцінку');
  return await res.json();
};

export const getUserRating = async (movieId: number, token: string) => {
  const res = await fetch(`${API_URL}/ratings/my/${movieId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Не вдалося отримати вашу оцінку');
  return await res.json();
};

export const addOrUpdateRating = async (movieId: number, rating: number, token: string) => {
  const res = await fetch(`${API_URL}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movie_id: movieId, rating })
  });
  if (!res.ok) throw new Error('Не вдалося оновити рейтинг');
  return await res.json();
};
