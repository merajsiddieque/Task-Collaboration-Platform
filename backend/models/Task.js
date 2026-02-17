const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

/* 🔍 TEXT INDEX FOR SEARCH */
taskSchema.index({ title: "text" });

module.exports = mongoose.model("Task", taskSchema);
