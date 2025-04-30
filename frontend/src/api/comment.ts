import axios from 'axios';
import { getAuthToken } from './auth.ts';

const API_URL = 'http://localhost:5000/api';

interface Comment {
  id: number;
  user_id: number;
  movie_id: number;
  text: string;
  created_at: string;
  username: string;
}

// Получить комментарии для фильма
export const getCommentsByMovie = async (movieId: number): Promise<Comment[]> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${movieId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Добавить новый комментарий
export const addComment = async (movieId: number, text: string): Promise<Comment> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/comments`,
      { movie_id: movieId, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Обновить комментарий
export const updateComment = async (commentId: number, text: string): Promise<Comment> => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `${API_URL}/comments/${commentId}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Удалить комментарий
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};