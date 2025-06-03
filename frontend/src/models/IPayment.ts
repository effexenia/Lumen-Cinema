export interface Payment {
  id: number;
  ticket_id: number;
  sessionId: number;
  movieId: number;
  amount: number;
  payment_time: string;
  status: string;
}
