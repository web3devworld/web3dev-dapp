// This dApp is property of Web3Dev Strategy Consulting
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { NFTListed, NFTSold, NFTRemoved } from "../generated/Marketplace/Marketplace";
import { NFT } from "../generated/schema";
import { Staked, Withdrawn, Claimed, Unstaked } from "../generated/Staking/Staking";
import { Stake } from "../generated/schema";

export function handleNFTListed(event: NFTListed): void {
  let nft = new NFT(event.params.tokenId.toString());
  nft.tokenId = event.params.tokenId;
  nft.owner = event.params.owner;
  nft.price = event.params.price;
  nft.metadataUri = event.params.metadataUri;
  nft.nftContract = event.params.nftContract;
  nft.save();
}

export function handleNFTSold(event: NFTSold): void {
  let nft = NFT.load(event.params.tokenId.toString());
  if (nft) {
    nft.owner = event.params.buyer;
    nft.save();
  }
}

export function handleNFTRemoved(event: NFTRemoved): void {
  let nft = NFT.load(event.params.tokenId.toString());
  if (nft) {
    nft.price = BigInt.fromI32(0);
    nft.save();
  }
}

export function handleStaked(event: Staked): void {
  let stake = new Stake(event.transaction.from.toHex());
  stake.user = event.transaction.from;
  stake.amount = event.params.amount;
  stake.lastClaimedTimestamp = event.block.timestamp;
  stake.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  let stake = Stake.load(event.transaction.from.toHex());
  if (stake) {
    stake.amount = event.params.amount;
    stake.save();
  }
}

export function handleClaimed(event: Claimed): void {
  let stake = Stake.load(event.transaction.from.toHex());
  if (stake) {
    stake.lastClaimedTimestamp = event.block.timestamp;
    stake.save();
  }
}

export function handleUnstaked(event: Unstaked): void {
  let stake = Stake.load(event.transaction.from.toHex());
  if (stake) {
    stake.amount = BigInt.fromI32(0);
    stake.save();
  }
}