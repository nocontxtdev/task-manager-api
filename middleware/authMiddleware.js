const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token in the headers
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // Log error for debugging
    console.error("JWT Error:", err.message);

    // Send generic error response
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};
