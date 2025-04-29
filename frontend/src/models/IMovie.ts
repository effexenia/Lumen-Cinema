 interface Genre {
    id: number;
    name: string;
  }
  
  export interface MovieCardProps {
    title: string;
    description: string;
    posterImg: string;
    genres: Genre[];
  }