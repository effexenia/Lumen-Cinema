export interface Seat {
  row: number;
  seat: number;
}

export interface Session {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;
  price: number;
  movie_title?: string;  
  hall_name?: string;   
}

export interface Hall {
  id: number;
  name: string;
  seat_rows: number;
  seat_cols: number;
}