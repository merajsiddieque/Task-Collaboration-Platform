const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByList,
  updateTask,
  deleteTask,
  searchTasks, // 👈 add this
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTask);

/* 🔍 SEARCH ROUTE (must come before :listId) */
router.get("/search", authMiddleware, searchTasks);

router.get("/:listId", authMiddleware, getTasksByList);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
