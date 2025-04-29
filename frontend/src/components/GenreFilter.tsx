import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

interface Genre {
  id: number;
  name: string;
}

type GenreFilterProps = {
  genre: string;
  setGenre: (value: string) => void;
};

export const GenreFilter: React.FC<GenreFilterProps> = ({ genre, setGenre }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await axios.get('http://localhost:5000/api/genres');
      setGenres(res.data);
    };
    fetchGenres();
  }, []);

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
        {genres.map((g) => (
          <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

