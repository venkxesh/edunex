require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// middleware
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// server start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
