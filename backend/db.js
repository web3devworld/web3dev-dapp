// This dApp is property of Web3Dev Strategy Consulting
const mongoose = require('mongoose');
const dbConfig = require('../config/dbConfig');

const connect = async () => {
  try {
    await mongoose.connect(dbConfig.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = { connect };