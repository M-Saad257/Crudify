import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CRUD"
    },
    title: String,
    description: String
  },
  {
    timestamps: true // 🔥 This adds createdAt and updatedAt automatically
  }
);

export const Task = mongoose.model("Task", taskSchema);
