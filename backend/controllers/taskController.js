const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const logActivity = require("../utils/logActivity");
const User = require("../models/User");

// ===============================
// Create Task
// ===============================
exports.createTask = async (req, res) => {
  try {
    const { title, description, listId, boardId } = req.body;

    if (!title || !listId || !boardId) {
      return res.status(400).json({
        message: "title, listId and boardId are required",
      });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const lastTask = await Task.findOne({ list: listId }).sort({
      position: -1,
    });

    const nextPosition = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      title,
      description: description || "",
      list: listId,
      board: boardId,
      position: nextPosition,
    });

    // Activity log
    await logActivity({
      boardId,
      userId: req.user._id,
      action: "TASK_CREATED",
      entityType: "TASK",
      entityId: task._id,
      message: `Created task "${task.title}"`,
    });

    // 🔥 Emit real-time event
    req.io.to(boardId).emit("taskCreated", task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Get Tasks By List
// ===============================
exports.getTasksByList = async (req, res) => {
  try {
    const tasks = await Task.find({
      list: req.params.listId,
    })
      .populate("assignedTo", "name email")
      .sort("position");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Update Task (Edit or Move)
// ===============================
exports.updateTask = async (req, res) => {
  try {
    const { title, description, listId, position, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await Board.findById(task.board);

    // 🔐 Validate requester is board member
    if (
      !board.members.some(
        (member) => member.toString() === req.user._id.toString(),
      )
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldListId = task.list.toString();
    const newListId = listId || oldListId;
    const oldPosition = task.position;

    /* ================= BASIC FIELD UPDATES ================= */

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    /* ================= TASK ASSIGNMENT ================= */

    /* ================= TASK ASSIGNMENT ================= */

    if (assignedTo !== undefined) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({
          message: "assignedTo must be an array of user IDs",
        });
      }

      // Validate all users exist
      const users = await User.find({ _id: { $in: assignedTo } });

      if (users.length !== assignedTo.length) {
        return res.status(404).json({
          message: "One or more users not found",
        });
      }

      // Validate all are board members
      const invalidUser = assignedTo.find(
        (userId) =>
          !board.members.some(
            (member) => member.toString() === userId.toString(),
          ),
      );

      if (invalidUser) {
        return res.status(400).json({
          message: "One or more users are not board members",
        });
      }

      task.assignedTo = assignedTo;
    }

    /* ================= POSITION LOGIC (UNCHANGED) ================= */

    if (position !== undefined) {
      if (newListId === oldListId) {
        if (position > oldPosition) {
          await Task.updateMany(
            { list: oldListId, position: { $gt: oldPosition, $lte: position } },
            { $inc: { position: -1 } },
          );
        } else if (position < oldPosition) {
          await Task.updateMany(
            { list: oldListId, position: { $gte: position, $lt: oldPosition } },
            { $inc: { position: 1 } },
          );
        }
      } else {
        await Task.updateMany(
          { list: oldListId, position: { $gt: oldPosition } },
          { $inc: { position: -1 } },
        );

        await Task.updateMany(
          { list: newListId, position: { $gte: position } },
          { $inc: { position: 1 } },
        );

        task.list = newListId;
      }

      task.position = position;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id).populate(
      "assignedTo",
      "name email",
    );

    req.io.to(task.board.toString()).emit("taskUpdated", populatedTask);

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Delete Task
// ===============================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const boardId = task.board.toString();

    await logActivity({
      boardId,
      userId: req.user._id,
      action: "TASK_DELETED",
      entityType: "TASK",
      entityId: task._id,
      message: `Deleted task "${task.title}"`,
    });

    await task.deleteOne();

    // 🔥 Emit real-time delete
    req.io.to(boardId).emit("taskDeleted", req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search
exports.searchTasks = async (req, res) => {
  try {
    const { boardId, query } = req.query;

    if (!boardId || !query) {
      return res.status(400).json({
        message: "Board ID and search query are required",
      });
    }

    const tasks = await Task.find(
      {
        board: boardId,
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      },
    )
      .populate("assignedTo", "name email")
      .sort({ score: { $meta: "textScore" } });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
