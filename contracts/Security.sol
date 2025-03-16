// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Security is Ownable {
    // Signature
    string internal constant SIGNATURE = "This dApp is property of Web3Dev Strategy Consulting";

    mapping(address => bool) public administrators;

    event AdministratorAdded(address indexed admin);
    event AdministratorRemoved(address indexed admin);

    modifier onlyAdmin() {
        require(administrators[msg.sender] || owner() == msg.sender, "Not authorized");
        _;
    }

    constructor() {
        administrators[owner()] = true;
    }

    function addAdministrator(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        administrators[_admin] = true;
        emit AdministratorAdded(_admin);
    }

    function removeAdministrator(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        administrators[_admin] = false;
        emit AdministratorRemoved(_admin);
    }
}