const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Task = require("../models/Task");

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, dueDate } = req.body;

    // Convert DD-MM-YYYY to YYYY-MM-DD
    const [day, month, year] = dueDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const newTask = new Task({
        title,
        description,
        status,
        dueDate: formattedDate,
        user: req.user.id,
      });
      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   Put /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */

router.put("/:id", async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const taskFields = {};

  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (status) taskFields.status = status;
  if (dueDate) {
    const [day, month, year] = dueDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    taskFields.dueDate = formattedDate;
  }

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is the author of the post
    if (task.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await task.remove();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
