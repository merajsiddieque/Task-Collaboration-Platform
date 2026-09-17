import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "https://task-collaboration-platform-lkx0.onrender.com"
);

export default socket;
