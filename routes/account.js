const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");

/**
 * @route   GET /api/account/
 * @desc    Get the authenticated user's details
 * @access  Private
 */
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   PUT /api/account/
 * @desc    Update user details (name, email)
 * @access  Private
 */
router.put(
  "/profile",
  [
    check("name", "Name is required").optional().notEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields if they are provided
      if (name) user.name = name;
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: "Email is already in use" });
        }
        user.email = email;
      }

      await user.save();
      res.json({
        message: "Account updated successfully",
        user: user.select("-password"),
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   PUT /api/account/password
 * @desc    Change the user's password
 * @access  Private
 */
router.put(
  "/password",
  [
    check("currentPassword", "Current password is required").notEmpty(),
    check("newPassword", "New password must be at least 8 characters")
      .isLength({ min: 8 })
      .isStrongPassword(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Update the user's password using findByIdAndUpdate
      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { password: newPassword } },
        { new: true }
      );

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   DELETE /api/account/delete
 * @desc    Delete the authenticated user's account
 * @access  Private
 */
router.delete("/delete", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // First, delete all tasks associated with the user
    await Task.deleteMany({ user: req.user.id });

    // Then, delete the user
    await user.remove();

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
