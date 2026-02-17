# 🧠 Real-Time Task Collaboration Platform

A Trello-like real-time task collaboration system built with a modern full-stack architecture.

This platform allows multiple users to create boards, manage lists and tasks, assign members, and collaborate in real-time using WebSockets.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication
- Secure login & registration
- Protected routes
- Role-based board ownership

### 🗂 Board Management
- Create & delete boards
- Board visibility restricted to members
- Add members to boards
- Dynamic board UI styling

### 📋 List Management
- Create lists inside boards
- List positioning

### 📝 Task Management
- Create, update, delete tasks
- Drag & drop reordering
- Cross-list movement
- Position recalculation algorithm
- Multi-user task assignment
- Validation against board membership

### 🔍 Search
- MongoDB text search
- Relevance-based sorting
- Debounced frontend search

### 🔄 Real-Time Collaboration
- Socket.io integration
- Board-based socket rooms
- Instant taskCreated, taskUpdated, taskDeleted sync
- Live collaboration across multiple clients

### 📊 Activity Logging
- Board-level activity tracking
- Stores action history
- Displays latest 50 actions
- Timestamped entries

---

## 🏗 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io

### Frontend
- React (Vite)
- Context API
- Axios (with interceptor)
- React Router
- dnd-kit (Drag & Drop)
- Socket.io-client

---

## 🧠 Architecture Overview

### 🔐 Authentication Flow
- User logs in
- JWT issued
- Token attached via Axios interceptor
- Middleware validates token and attaches `req.user`

### 🏠 Real-Time Room Architecture
- Each board = Socket room
- On board open → user joins room
- On update → emit event to that board room only

### 📌 Drag & Drop Algorithm
- Position recalculated server-side
- Uses `updateMany` to shift tasks safely
- Prevents inconsistent ordering

### 👥 Membership Validation
- All task operations validated against board members
- Assignment restricted to board members only

---

## 📂 Project Structure

```
backend/
  controllers/
  models/
  routes/
  middleware/
  utils/

frontend/
  components/
  hooks/
  context/
  pages/
  api/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd task-collaboration-platform
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Boards
- GET `/api/boards`
- POST `/api/boards`
- DELETE `/api/boards/:id`
- POST `/api/boards/:id/invite`

### Lists
- POST `/api/lists`
- GET `/api/lists/:boardId`

### Tasks
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- GET `/api/tasks/:listId`
- GET `/api/tasks/search`

### Activity
- GET `/api/activity/:boardId`

---

## 🧪 Example Use Cases

- Multiple users collaborating on same board
- Real-time drag & drop sync
- Assigning multiple members to a task
- Live activity feed updates
- Searching tasks instantly

---

## 🎯 Why This Project?

This project demonstrates:

- Real-time architecture design
- State synchronization challenges
- Access control & authorization
- Scalable MongoDB schema modeling
- Clean separation of frontend & backend
- Modern React patterns with hooks

---

## 📌 Future Improvements (Optional)

- Role-based permissions (Admin / Member)
- Invite acceptance workflow
- Pagination
- Redis for socket scaling
- Production-level logging
- CI/CD deployment

---

## 👤 Author

Developed by Alam  
Full-stack Developer  

---

## ⭐ Final Notes

This project simulates real-world collaborative systems like Trello and Asana, focusing on real-time data consistency, user access control, and scalable architecture.

