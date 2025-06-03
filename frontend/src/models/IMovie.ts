export interface Genre {
  id: number;
  name: string;
}

export type Movie = {
  id: number;
  title: string;
  posterImg: string;
  bannerImg: string;
  genres: Genre[];
  description: string;
  summary: string;
  language: string;
  release_date: string;
  country: string;
  studio: string;
  showtimes: string[];
  trailerUrl?: string; // <-- нове
  averageRating: number | null;
};
