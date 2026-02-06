const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
