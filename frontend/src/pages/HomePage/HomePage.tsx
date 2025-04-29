import React from 'react';
import MovieSlider from '../../components/MovieSlider.tsx';
import MovieGrid from '../../components/MovieGrid.tsx';
import './HomePage.module.css';

const HomePage = () => {
  return (
    <div>
      <MovieSlider />
      <MovieGrid />
    </div>
  );
};

export default HomePage;
