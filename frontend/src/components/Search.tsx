import React, { useState, useEffect, useRef } from 'react';
import { searchMovies } from '../api/api.ts';
import { useNavigate } from 'react-router-dom';
import styles from './Search.module.css';
import { Movie } from '../models/IMovie';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchMovies(query);
        setResults(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        console.error('Помилка пошуку:', error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: number) => {
    navigate(`/movie/${id}`);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук фільмів..."
        className={styles.input}
        onFocus={() => query && results.length > 0 && setShowDropdown(true)}
      />
      {isSearching && query.length > 0 && (
        <div className={styles.loading}>Пошук...</div>
      )}
      {showDropdown && (
        <ul className={styles.dropdown}>
          {results.length > 0 ? (
            results.map((movie) => (
              <li key={movie.id} onClick={() => handleSelect(movie.id)} className={styles.dropdownItem}>
                <img src={movie.posterImg} alt={movie.title} className={styles.poster} />
                <div>
                  <strong>{movie.title}</strong>
                  <div className={styles.meta}>{movie.release_date?.slice(0, 4) || '—'}</div>
                </div>
              </li>
            ))
          ) : (
            !isSearching && <li className={styles.noResults}>Нічого не знайдено</li>
          )}
        </ul>
      )}
    </div>
  );
};