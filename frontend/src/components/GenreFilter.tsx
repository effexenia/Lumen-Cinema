import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

type GenreFilterProps = {
  genre: string;
  setGenre: (value: string) => void;
};

export const GenreFilter: React.FC<GenreFilterProps> = ({ genre, setGenre }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="genre-label">Жанр</InputLabel>
      <Select
        labelId="genre-label"
        value={genre}
        label="Жанр"
        onChange={(e) => setGenre(e.target.value)}
      >
        <MenuItem value="">Усі жанри</MenuItem>
        <MenuItem value="action">Action</MenuItem>
        <MenuItem value="comedy">Comedy</MenuItem>
        <MenuItem value="fantasy">Fantasy</MenuItem>
        <MenuItem value="sci-fi">Sci-fi</MenuItem>
        <MenuItem value="thriller">Thriller</MenuItem>
        {/* Додай свої жанри */}
      </Select>
    </FormControl>
  );
};
