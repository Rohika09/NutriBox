// Simple Express server with MongoDB (Mongoose) connection
// - Loads environment variables from .env
// - Connects to MongoDB
// - Exposes REST endpoints under /api/orders

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware: parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Import routes
const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;

console.log("Mongo URI found:", !!MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
