const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");

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
    check("status", "Invalid status")
      .optional()
      .isIn(["Not Started", "In Progress", "Completed"]),
    check("priority", "Invalid priority")
      .optional()
      .isIn(["Low", "Medium", "High"]),
    check("dueDate", "Invalid date").optional().isISO8601(),
  ],
  taskController.createTask
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Private
 */
router.get("/", taskController.getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
router.get("/:id", taskController.getTaskByID);

/**
 * @route   Put /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */

router.put(
  "/:id",
  [
    check("status", "Invalid status")
      .optional()
      .isIn(["Not Started", "In Progress", "Completed"]),
    check("priority", "Invalid priority")
      .optional()
      .isIn(["Low", "Medium", "High"]),
    check("dueDate", "Invalid date").optional().isISO8601(),
  ],
  taskController.updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete("/:id", taskController.deleteTask);

module.exports = router;
