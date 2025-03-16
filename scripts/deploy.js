// This dApp is property of Web3Dev Strategy Consulting
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(1000000); // 1 million initial supply

  await token.deployed();

  console.log("Token deployed to:", token.address);

  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();

  await verifier.deployed();

  console.log("Verifier deployed to:", verifier.address);

  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(token.address, verifier.address, ethers.utils.parseUnits("0.01", 18)); // 0.01 rewards per day

  await staking.deployed();

  console.log("Staking deployed to:", staking.address);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.deployed();

  console.log("Marketplace deployed to:", marketplace.address);

  const Security = await hre.ethers.getContractFactory("Security");
  const security = await Security.deploy();

  await security.deployed();

  console.log("Security deployed to:", security.address);

  // Update subgraph.yaml with contract addresses
  const fs = require('fs');
  const subgraphYamlPath = '../subgraph/subgraph.yaml';
  let subgraphYaml = fs.readFileSync(subgraphYamlPath, 'utf8');
  subgraphYaml = subgraphYaml.replace(/YOUR_MARKETPLACE_CONTRACT_ADDRESS/g, marketplace.address);
  subgraphYaml = subgraphYaml.replace(/YOUR_STAKING_CONTRACT_ADDRESS/g, staking.address);
  fs.writeFileSync(subgraphYamlPath, subgraphYaml, 'utf8');

  console.log("Subgraph YAML updated with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });