export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string | null;
  dob?: string | null;  
  created_at?: string;
  role?: string;  
}