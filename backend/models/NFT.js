// This dApp is property of Web3Dev Strategy Consulting
const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  owner: String,
  tokenId: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NFT', NFTSchema);