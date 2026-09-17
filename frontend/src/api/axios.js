import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://task-collaboration-platform-lkx0.onrender.com";

// Normalize baseURL so API routes (/auth, /boards, etc.) resolve properly
const baseURL = API_URL.endsWith("/api")
  ? API_URL
  : `${API_URL.replace(/\/+$/, "")}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
