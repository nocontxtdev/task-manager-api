const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post(
  "/register",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password should be at least 8 characters")
      .isLength({
        min: 8,
      })
      .isStrongPassword(),
  ],
  authController.userRegister
);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", authController.userLogin);

module.exports = router;
