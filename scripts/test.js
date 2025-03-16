// This dApp is property of Web3Dev Strategy Consulting
const { expect } = require("chai");

describe("Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy(1000000);
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, 50);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(50);

    await token.connect(addr1).transfer(addr2.address, 50);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await expect(
      token.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });

  it("Should mint tokens to an address", async function () {
    await token.mint(addr1.address, 100);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(100);
  });

  it("Should burn tokens from an address", async function () {
    await token.mint(addr1.address, 100);
    await token.connect(addr1).burn(50);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(50);
  });
});

describe("Staking", function () {
  let Token, token, Staking, staking, Verifier, verifier, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    Verifier = await ethers.getContractFactory("Verifier");
    Staking = await ethers.getContractFactory("Staking");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy(1000000);
    verifier = await Verifier.deploy();
    staking = await Staking.deploy(token.address, verifier.address, ethers.utils.parseUnits("0.01", 18));
    await token.mint(addr1.address, 1000);
    await token.connect(addr1).approve(staking.address, 1000);
  });

  it("Should stake tokens", async function () {
    await staking.connect(addr1).stake(100);
    const stake = await staking.stakes(addr1.address);
    expect(stake.amount).to.equal(100);
  });

  it("Should withdraw tokens", async function () {
    await staking.connect(addr1).stake(100);
    await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block
    await staking.connect(addr1).withdraw(50);
    const stake = await staking.stakes(addr1.address);
    expect(stake.amount).to.equal(50);
  });

  it("Should claim rewards", async function () {
    await staking.connect(addr1).stake(100);
    await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block
    await staking.connect(addr1).claim([0, 0], [[0, 0], [0, 0]], [0, 0], [100, 3600]);
    const stake = await staking.stakes(addr1.address);
    expect(stake.amount).to.equal(100);
  });

  it("Should unstake tokens", async function () {
    await staking.connect(addr1).stake(100);
    await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block
    await staking.connect(addr1).unstake();
    const stake = await staking.stakes(addr1.address);
    expect(stake.amount).to.equal(0);
  });
});

describe("Marketplace", function () {
  let Token, token, Marketplace, marketplace, ERC721Mock, erc721Token, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    Marketplace = await ethers.getContractFactory("Marketplace");
    ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy(1000000);
    marketplace = await Marketplace.deploy();
    erc721Token = await ERC721Mock.deploy("TestNFT", "TNFT");
    await erc721Token.mint(addr1.address, 1);
    await erc721Token.connect(addr1).setApprovalForAll(marketplace.address, true);
  });

  it("Should list an NFT", async function () {
    await marketplace.connect(addr1).listNFT(erc721Token.address, 1, 100, "metadataUri");
    const nft = await marketplace.nfts(1);
    expect(nft.price).to.equal(100);
  });

  it("Should buy an NFT", async function () {
    await marketplace.connect(addr1).listNFT(erc721Token.address, 1, 100, "metadataUri");
    await marketplace.connect(addr2).buyNFT(1, { value: 100 });
    const nft = await marketplace.nfts(1);
    expect(nft.owner).to.equal(addr2.address);
  });

  it("Should remove an NFT", async function () {
    await marketplace.connect(addr1).listNFT(erc721Token.address, 1, 100, "metadataUri");
    await marketplace.connect(addr1).removeNFT(1);
    const nft = await marketplace.nfts(1);
    expect(nft.price).to.equal(0);
  });
});