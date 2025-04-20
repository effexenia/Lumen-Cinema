import React from 'react';
import Grid from '@mui/material/Grid';      // v2 API!
import { MovieCard } from './MovieCard.tsx';
import { Movie } from '../types/movie';

type Props = { movies: Movie[]; };

export const MovieGrid: React.FC<Props> = ({ movies }) => (
  <Grid container spacing={3}>
    {movies.map((movie) => (
      // — прибираємо `item`
      // — використовуємо `size` замість xs/sm/md
      <Grid
        key={movie._id}
        size={{ xs: 12, sm: 6, md: 3 }}
      >
        <MovieCard movie={movie} />
      </Grid>
    ))}
  </Grid>
);
