// This dApp is property of Web3Dev Strategy Consulting
import React from 'react';

const NFTCard = ({ nft }) => {
  return (
    <div className="nft-card">
      <img src={nft.image} alt={nft.name} />
      <h2>{nft.name}</h2>
      <p>{nft.description}</p>
      <p>Price: {nft.price} ETH</p>
      <p>Owner: {nft.owner}</p>
    </div>
  );
};

export default NFTCard;