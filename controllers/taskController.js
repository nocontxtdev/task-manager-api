const { validationResult } = require("express-validator");
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, status, priority, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id,
      activityLog: [{ action: "Task created", date: new Date() }],
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .select("-user")
      .sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getTaskByID = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).select("-user");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const taskFields = {};
  const activityEntry = [];

  if (title) taskFields.title = title;

  if (description) taskFields.description = description;

  if (status) {
    taskFields.status = status;
    activityEntry.push({
      action: `Status updated to ${status}`,
      date: new Date(),
    });
  }

  if (dueDate) taskFields.dueDate = dueDate;

  if (priority) {
    taskFields.priority = priority;
    activityEntry.push({
      action: `Priority updated to ${priority}`,
      date: new Date(),
    });
  }

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    taskFields.activityLog = [...task.activityLog, ...activityEntry];

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
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is the owner of the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await task.remove();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
