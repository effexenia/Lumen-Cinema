import { Container, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/movie';
import { MovieSlider } from '../components/MovieSlider.tsx';
import { SearchBar } from '../components/SearchBar.tsx';
import { GenreFilter } from '../components/GenreFilter.tsx';
import { MovieGrid } from '../components/MovieGrid.tsx';
import axios from 'axios';

export const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    axios.get('/api/movies') // твій бекенд
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (genre ? movie.genre.map(g => g.toLowerCase()).includes(genre) : true)
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <MovieSlider />
      <Box mt={4}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <GenreFilter genre={genre} setGenre={setGenre} />
      </Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Now Playing
      </Typography>
      <MovieGrid movies={filteredMovies} />
    </Container>
  );
};
