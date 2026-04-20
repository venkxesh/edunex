// Entry point for EduNex backend server.
// Sets up Express, connects MongoDB, and wires auth routes.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/aiRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware to parse incoming JSON request bodies.
app.use(express.json());
app.use(cors());

// Public auth routes: /signup and /login
app.use('/', authRoutes);
app.use('/api/ai', aiRoutes);

// Protected demo route (requires valid JWT in Authorization header).
app.get('/dashboard', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Welcome to your dashboard, ${req.user.email}`,
    userId: req.user.id
  });
});

// Fallback handler for undefined routes.
app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`EduNex backend running on port ${PORT}`);
});
