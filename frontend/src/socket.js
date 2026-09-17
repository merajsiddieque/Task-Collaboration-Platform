import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  "https://task-collaboration-platform-lkx0.onrender.com";

// Ensure socket connects to the host root without /api
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
