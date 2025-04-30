import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MovieReviews.module.css';

interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  text: string;
  rating: number;
  created_at: string;
  username: string;
}

interface UserRating {
  rating: number | null;
}

const MovieReviews: React.FC<{ movieId: number }> = ({ movieId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<UserRating>({ rating: null });
  const [comment, setComment] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка аутентификации
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Загрузка рейтингов и комментариев
    const fetchData = async () => {
      try {
        const [reviewsRes, ratingRes] = await Promise.all([
          fetch(`http://localhost:5000/movies/${movieId}/reviews`),
          token && fetch(`http://localhost:5000/ratings/my/${movieId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        if (token && ratingRes) {
          const ratingData = await ratingRes.json();
          setUserRating(ratingData);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [movieId]);

  const handleRatingChange = (newRating: number) => {
    if (!isAuthenticated) {
      alert('Будь ласка, увійдіть для оцінювання');
      return;
    }
    setUserRating({ rating: newRating });
  };

  const handleSubmitRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: movieId,
          rating: userRating.rating
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit rating');
      
      alert('Рейтинг успішно оновлено!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Помилка при оновленні рейтингу');
    }
  };

  const handleSubmitComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: movieId,
          text: comment
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit comment');
      
      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setComment('');
      alert('Коментар успішно додано!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Помилка при додаванні коментаря');
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;

  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.sectionTitle}>Відгуки та рейтинги</h2>
      
      <div className={styles.ratingSection}>
        <h3>Ваша оцінка</h3>
        {isAuthenticated ? (
          <>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${userRating.rating && star <= userRating.rating ? styles.filled : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
            {userRating.rating && (
              <button 
                className={styles.submitButton}
                onClick={handleSubmitRating}
              >
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
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <span className={styles.username}>{review.username}</span>
                  <span className={styles.date}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  {review.rating && (
                    <span className={styles.commentRating}>
                      Оцінка: {review.rating}/5
                    </span>
                  )}
                </div>
                <p className={styles.commentText}>{review.text}</p>
              </div>
            ))
          ) : (
            <p>Ще немає відгуків</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieReviews;