const List = require("../models/List");
const Board = require("../models/Board");

// Create List
exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    // Check if board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user is member
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const list = await List.create({
      title,
      board: boardId,
      position: 0,
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Lists by Board
exports.getListsByBoard = async (req, res) => {
  try {
    const lists = await List.find({
      board: req.params.boardId,
    }).sort("position");

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
