const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "1h",
      });

      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
