// This dApp is property of Web3Dev Strategy Consulting
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const nftRoutes = require('./routes/nftRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
db.connect();

// Routes
app.use('/api/nfts', nftRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});