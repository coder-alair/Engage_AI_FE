
import axios from 'axios';

 const BACKEND_BASE_URL=import.meta.env.VITE_API_BASE_URL
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/api/user/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  
  }
};
