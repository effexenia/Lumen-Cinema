const API_URL = 'http://localhost:5000/api';

export const getCommentsByMovie = async (movieId: number) => {
  const res = await fetch(`${API_URL}/movies/${movieId}/comments`);
  if (!res.ok) throw new Error('Не вдалося отримати коментарі');
  return await res.json();
};

export const addComment = async (movieId: number, content: string, token: string) => {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movie_id: movieId, content })
  });
  if (!res.ok) throw new Error('Не вдалося додати коментар');
  return await res.json();
};
