export interface Comment {
    id: number;
    user_id: number;
    movie_id: number;
    text: string;
    created_at: string;
    username: string;
  }
  
  export interface CommentFormData {
    movie_id: number;
    text: string;
  }