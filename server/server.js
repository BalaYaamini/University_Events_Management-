const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const testRoutes = require("./routes/testRoutes");
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend with DB is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
