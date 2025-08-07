import React, { useState } from 'react';
import styles from './TrailerButton.module.css'; 

interface TrailerButtonProps {
  trailerUrl?: string;
  buttonClassName?: string;
  modalClassName?: string;
}

const TrailerButton: React.FC<TrailerButtonProps> = ({ 
  trailerUrl, 
  buttonClassName = '', 
  modalClassName = '' 
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /youtu\.be\/([^#&?]+)/,
      /youtube\.com\/embed\/([^#&?]+)/,
      /youtube\.com\/watch\?v=([^#&?]+)/,
      /youtube\.com\/v\/([^#&?]+)/,
      /youtube\.com\/user\/.*#\w\/\w\/\w\/\w\/(\w+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].length === 11 ? match[1] : null;
      }
    }

    const directMatch = url.match(/[^#&?]{11}/);
    return directMatch ? directMatch[0] : null;
  };

  const handleButtonClick = () => {
    if (trailerUrl && trailerUrl.trim() !== '' && extractVideoId(trailerUrl)) {
      setShowTrailer(true);
      setVideoError(false);
    } else {
      alert("Трейлер недоступний");
    }
  };

  return (
    <>
      <button
        className={`${styles.trailerButton} ${buttonClassName}`}
        onClick={handleButtonClick}
      >
        &#x23F5; Трейлер
      </button>

      {showTrailer && trailerUrl && (
        <div 
          className={`${styles.trailerModal} ${modalClassName}`} 
          onClick={() => setShowTrailer(false)}
        >
          <div 
            className={styles.trailerModalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closeTrailerButton} 
              onClick={() => setShowTrailer(false)}
            >
              &times;
            </button>
            
            {videoError ? (
              <div className={styles.videoError}>Не удалось загрузить трейлер</div>
            ) : extractVideoId(trailerUrl) ? (
              // eslint-disable-next-line jsx-a11y/iframe-has-title
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractVideoId(trailerUrl)}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setVideoError(true)}
              />
            ) : (
              <video 
                controls 
                autoPlay 
                style={{ width: '100%', height: '100%' }}
                onError={() => setVideoError(true)}
              >
                <source src={trailerUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerButton;