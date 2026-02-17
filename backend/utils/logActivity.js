const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  boardId,
  userId,
  action,
  entityType,
  entityId,
  message
}) => {
  try {
    await ActivityLog.create({
      board: boardId,
      user: userId,
      action,
      entityType,
      entityId,
      message
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

module.exports = logActivity;
