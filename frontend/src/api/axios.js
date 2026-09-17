import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://task-collaboration-platform-lkx0.onrender.com/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
