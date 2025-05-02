import React, { useState, useEffect } from 'react';
import styles from './MovieReviews.module.css';
import { getCommentsByMovie, addComment } from '../api/commentService.ts';
import { getUserRating, addOrUpdateRating, getAverageRating } from '../api/ratingService.ts';

interface Comment {
  id: number;
  user_id: number;
  name: string;
  movie_id: number;
  content: string;
  created_at: string;
}

const MovieReviews: React.FC<{ movieId: number }> = ({ movieId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    const savedRating = localStorage.getItem(`movie_${movieId}_rating`);
    if (savedRating) {
      setUserRating(parseInt(savedRating));
    }

    const fetchData = async () => {
      try {
        // Load comments
        const commentsData = await getCommentsByMovie(movieId);
        setComments(commentsData);

        // Load user rating if authenticated
        if (token) {
          const rating = await getUserRating(movieId, token);
          setUserRating(rating);
        }

        // Load average rating
        const avgRating = await getAverageRating(movieId);
        setAverageRating(avgRating);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleRatingChange = (value: number) => {
    if (!isAuthenticated) return alert('Увійдіть, щоб оцінити');
    setUserRating(value);
  };

  const handleSubmitRating = async () => {
    try {
      const token = localStorage.getItem('token')!;
      await addOrUpdateRating(movieId, userRating!, token);
      alert('Оцінка успішно оновлена!');
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Помилка при оновленні оцінки');
    }
  };

  const handleSubmitComment = async () => {
    try {
      const token = localStorage.getItem('token')!;
      await addComment(movieId, comment, token);
      const updatedComments = await getCommentsByMovie(movieId);
      setComments(updatedComments);
      setComment('');
      alert('Коментар успішно додано!');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Помилка при додаванні коментаря');
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;

  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.sectionTitle}>Відгуки та рейтинги</h2>
      <div className={styles.ratingSection}>
        <h4>Ваша оцінка</h4>
        {isAuthenticated ? (
          <>
            <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  userRating !== null && star <= userRating ? styles.filled : ''
                }`}
                onClick={() => handleRatingChange(star)}>
                ★
              </span>
            ))}

            </div>
            {userRating && (
              <button className={styles.submitButton} onClick={handleSubmitRating}>
                Підтвердити оцінку
              </button>
            )}
          </>
        ) : (
          <p>Увійдіть, щоб залишити оцінку</p>
        )}
      </div>

      <div className={styles.commentSection}>
        <h3>Коментарі</h3>
        {isAuthenticated ? (
          <>
            <textarea
              className={styles.commentInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ваш відгук про фільм..."
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
            >
              Надіслати
            </button>
          </>
        ) : (
          <p>Увійдіть, щоб залишити коментар</p>
        )}

        <div className={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((review) => (
              <div key={review.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                <span className={styles.username}>{review.name}</span>
                  <span className={styles.date}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.content}</p>
              </div>
            ))
          ) : (
            <p>Коментарів ще немає</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieReviews;