export const getAuthToken = (): string => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };
  
  export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };