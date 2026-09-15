import axios from "axios";

const AUTH_TOKEN_KEY = "job-board-auth-token";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// A Render API is cross-site from a Vercel deployment. Some browsers refuse
// third-party cookies, so send the login token explicitly as a fallback.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveAuthToken = (token) => {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

export default api;
