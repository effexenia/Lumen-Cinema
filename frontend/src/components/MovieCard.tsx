// components/MovieCard.tsx
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Movie } from '../types/movie';
import React from 'react';

export const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Card sx={{ backgroundColor: '#1e1e1e', maxWidth: 220 }}>
      <CardMedia
        component="img"
        image={movie.posterUrl}
        alt={movie.title}
        sx={{ height: 320 }}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="gray">
          ⭐ {movie.rating} · {new Date(movie.releaseDate).getFullYear()}
        </Typography>
      </CardContent>
    </Card>
  );
};
