require("dotenv").config();

const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

connectDB();

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("AI fitness api running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
