import { TextField } from '@mui/material';
import React from 'react';

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      fullWidth
      label="Пошук фільму"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
};
