// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Verifier.sol";

contract Staking is Ownable, ReentrancyGuard {
    // Signature
    string internal constant SIGNATURE = "This dApp is property of Web3Dev Strategy Consulting";

    IERC20 public token;
    Verifier public verifier;
    uint256 public rewardRate;

    struct Stake {
        uint256 amount;
        uint256 lastClaimedTimestamp;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address _tokenAddress, address _verifierAddress, uint256 _rewardRate) {
        token = IERC20(_tokenAddress);
        verifier = Verifier(_verifierAddress);
        rewardRate = _rewardRate;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        token.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].lastClaimedTimestamp = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient balance");
        claim(); // Claim rewards before withdrawing
        token.transfer(msg.sender, amount);
        stakes[msg.sender].amount -= amount;
        emit Withdrawn(msg.sender, amount);
    }

    function unstake() external nonReentrant {
        claim(); // Claim rewards before unstaking
        uint256 amount = stakes[msg.sender].amount;
        token.transfer(msg.sender, amount);
        delete stakes[msg.sender];
        emit Unstaked(msg.sender, amount);
    }

    function claim(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) external nonReentrant {
        require(verifier.verifyProof(a, b, c, input), "Invalid proof");
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");

        stakes[msg.sender].lastClaimedTimestamp = block.timestamp;
        token.transfer(msg.sender, rewards);

        emit Claimed(msg.sender, rewards);
    }

    function calculateRewards(address user) public view returns (uint256) {
        Stake memory stake = stakes[user];
        if (stake.amount == 0) return 0;
        uint256 duration = block.timestamp - stake.lastClaimedTimestamp;
        return (stake.amount * duration * rewardRate) / (365 days);
    }
}