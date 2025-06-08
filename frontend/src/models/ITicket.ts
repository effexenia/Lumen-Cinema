export interface Ticket {
  ticket_id: number;
  seat_row: number;
  seat_col: number;
  start_time: string;
  movie: string;
  hall: string;
  price: number;
  status: 'booked' | 'cancelled' | 'paid';
}
