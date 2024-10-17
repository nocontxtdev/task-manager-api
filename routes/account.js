const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const accountController = require("../controllers/accountController");

/**
 * @route   GET /api/account/
 * @desc    Get the authenticated user's details
 * @access  Private
 */
router.get("/profile", accountController.getProfile);

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
  accountController.updateProfile
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
  accountController.changePassword
);

/**
 * @route   DELETE /api/account/delete
 * @desc    Delete the authenticated user's account
 * @access  Private
 */
router.delete("/delete", accountController.deleteAccount);

module.exports = router;
