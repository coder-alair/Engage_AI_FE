import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const resetRequest = async (email) => {
  try {
    const response = await axios.post(`${VITE_API_BASE_URL}/api/user/forgot_password`, {
      email
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};
