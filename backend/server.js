require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ NEW

const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// 🔥 SERVE FRONTEND (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "../")));

// routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🔥 HOME ROUTE (FIXES "Cannot GET /")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
