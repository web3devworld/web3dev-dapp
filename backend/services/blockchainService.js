// This dApp is property of Web3Dev Strategy Consulting
const { ethers } = require('ethers');
const web3Config = require('../config/web3Config');

const provider = new ethers.providers.JsonRpcProvider(web3Config.providerUrl);

async function getAccountBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

module.exports = {
  getAccountBalance,
};