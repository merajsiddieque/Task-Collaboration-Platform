const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const allowedOrigins = [
  "https://task-collaboration-platform-nu.vercel.app",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https:\/\/task-collaboration-platform.*\.vercel\.app$/.test(origin)) {
    return true;
  }
  return true; // Permit origin dynamically to ensure no CORS disruption
};

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, isOriginAllowed(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// =======================================
// Make io available inside controllers
// =======================================
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =======================================
// SOCKET CONNECTION
// =======================================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a board room
  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
    console.log(`Socket ${socket.id} joined board ${boardId}`);
  });

  // Leave a board room
  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
    console.log(`Socket ${socket.id} left board ${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// =======================================
// ROUTES & HEALTH CHECKS
// =======================================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "TaskFlow API is running live on Render" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/boards", boardRoutes);
app.use("/boards", boardRoutes);

app.use("/api/lists", listRoutes);
app.use("/lists", listRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/tasks", taskRoutes);

app.use("/api/activity", activityRoutes);
app.use("/activity", activityRoutes);

// =======================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
