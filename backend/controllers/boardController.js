const User = require("../models/User");
const Board = require("../models/Board");

exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check requester is board member
    const isMember = board.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = board.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
    }

    board.members.push(user._id);
    await board.save();

    res.json({ message: "Member added successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Board
exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Board.create({
      title,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user._id,
    }).populate("owner", "name email");

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Board
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("members", "name email")
      .populate("owner", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await board.deleteOne();

    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
