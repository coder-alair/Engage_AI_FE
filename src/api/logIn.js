import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const logIn = async (email, password) => {
  try {
    const response = await axios.post(`${VITE_API_BASE_URL}/api/user/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};
