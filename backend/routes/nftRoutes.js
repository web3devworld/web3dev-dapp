// This dApp is property of Web3Dev Strategy Consulting
const express = require('express');
const router = express.Router();
const NFT = require('../models/NFT');
const blockchainService = require('../services/blockchainService');

// Get all NFTs
router.get('/', async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.json(nfts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new NFT
router.post('/', async (req, res) => {
  const nft = new NFT({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    owner: req.body.owner,
    tokenId: req.body.tokenId,
  });

  try {
    const newNFT = await nft.save();
    res.status(201).json(newNFT);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an NFT
router.patch('/:id', getNFT, async (req, res) => {
  if (req.body.name != null) {
    res.nft.name = req.body.name;
  }
  if (req.body.description != null) {
    res.nft.description = req.body.description;
  }
  if (req.body.image != null) {
    res.nft.image = req.body.image;
  }
  if (req.body.price != null) {
    res.nft.price = req.body.price;
  }
  if (req.body.owner != null) {
    res.nft.owner = req.body.owner;
  }

  try {
    const updatedNFT = await res.nft.save();
    res.json(updatedNFT);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an NFT
router.delete('/:id', getNFT, async (req, res) => {
  try {
    await res.nft.remove();
    res.json({ message: 'Deleted NFT' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get NFT by ID
async function getNFT(req, res, next) {
  let nft;
  try {
    nft = await NFT.findById(req.params.id);
    if (nft == null) {
      return res.status(404).json({ message: 'Cannot find NFT' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.nft = nft;
  next();
}

module.exports = router;