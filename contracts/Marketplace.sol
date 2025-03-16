// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    // Signature
    string internal constant SIGNATURE = "This dApp is property of Web3Dev Strategy Consulting";

    struct NFT {
        uint256 tokenId;
        address owner;
        uint256 price;
        string metadataUri;
        address nftContract;
    }

    mapping(uint256 => NFT) public nfts;
    uint256 public nftCount;

    event NFTListed(uint256 indexed tokenId, address owner, uint256 price, string metadataUri, address nftContract);
    event NFTSold(uint256 indexed tokenId, address buyer, uint256 price, address nftContract);
    event NFTRemoved(uint256 indexed tokenId);

    function listNFT(address nftContract, uint256 tokenId, uint256 price, string memory metadataUri) external {
        require(price > 0, "Price must be greater than 0");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner of the token");
        require(IERC721(nftContract).isApprovedForAll(msg.sender, address(this)), "Contract not approved");

        nftCount++;
        nfts[tokenId] = NFT(tokenId, msg.sender, price, metadataUri, nftContract);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit NFTListed(tokenId, msg.sender, price, metadataUri, nftContract);
    }

    function buyNFT(uint256 tokenId) external payable nonReentrant {
        NFT storage nft = nfts[tokenId];
        require(nft.price > 0, "NFT not listed");
        require(msg.value == nft.price, "Incorrect price");

        nft.owner = msg.sender;
        IERC721(nft.nftContract).transferFrom(address(this), msg.sender, tokenId);
        payable(nft.owner).transfer(msg.value);
        emit NFTSold(tokenId, msg.sender, nft.price, nft.nftContract);
    }

    function removeNFT(uint256 tokenId) external {
        NFT storage nft = nfts[tokenId];
        require(nft.owner == msg.sender, "Not the owner");
        IERC721(nft.nftContract).transferFrom(address(this), msg.sender, tokenId);
        delete nfts[tokenId];
        emit NFTRemoved(tokenId);
    }
}