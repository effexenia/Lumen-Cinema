// components/MovieSlider.tsx
import { useEffect, useState } from 'react';
import { getAllMovies } from '../api/api.ts';
import { Movie } from '../types/movie';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Box, Typography } from '@mui/material';
import React from 'react';

export const MovieSlider = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllMovies();
      setMovies(data);
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        🎬 Now in Cinema
      </Typography>
      <Swiper spaceBetween={16} slidesPerView={4}>
        {movies.slice(0, 10).map((movie) => (
          <SwiperSlide key={movie._id}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                borderRadius: '12px',
                height: '400px',
                width: '100%',
                objectFit: 'cover',
              }}
            />
            <Typography mt={1} textAlign="center">
              {movie.title}
            </Typography>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
