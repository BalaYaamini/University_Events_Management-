const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const testRoutes = require("./routes/testRoutes");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);

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
