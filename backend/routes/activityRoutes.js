const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const auth = require("../middleware/authMiddleware");

// Get activity logs for a board
router.get("/:boardId", auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      board: req.params.boardId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
