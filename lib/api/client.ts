import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Redirects to /login on 401 for non-auth endpoints (auth routes handle errors inline)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.includes('/auth/')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
