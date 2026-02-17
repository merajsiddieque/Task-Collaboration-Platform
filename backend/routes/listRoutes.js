const express = require("express");
const router = express.Router();

const {
  createList,
  getListsByBoard,
} = require("../controllers/listController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createList);
router.get("/:boardId", authMiddleware, getListsByBoard);

module.exports = router;
