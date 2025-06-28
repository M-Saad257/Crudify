import express from 'express';
import { Task } from '../models/Task.js';

const router = express.Router();

// GET tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST task for a user
router.post('/:userId', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      userId: req.params.userId,
      title,
      description
    });
    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// DELETE task by ID
router.delete('/delete/:taskId', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
// PUT /tasks/update/:taskId
router.put('/update/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ task: updatedTask });
  } catch (err) {
    console.error("Failed to update task:", err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
