const express = require("express");
const router = express.Router();


const {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  inviteMember,
} = require("../controllers/boardController");

const protect = require("../middleware/authMiddleware");

console.log({
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  inviteMember,
});


// Routes
router.post("/", protect, createBoard);
router.get("/", protect, getBoards);
router.get("/:id", protect, getBoardById);
router.delete("/:id", protect, deleteBoard);
router.post("/:id/invite", protect, inviteMember);

module.exports = router;
