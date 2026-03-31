const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Server file started...");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

// 🔥 connect DB
connectDB();

// 🔥 middlewares
app.use(cors({
  origin: "*",
}));
app.use(express.json());

// 🔥 routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

// 🔥 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});