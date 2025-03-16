// This dApp is property of Web3Dev Strategy Consulting
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NFTCard from '../components/NFTCard';
import useWeb3 from '../hooks/useWeb3';

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { web3, accounts } = useWeb3();

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nfts');
      const data = await response.json();
      setNfts(data);
    } catch (error) {
      setError('Error fetching NFTs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Web3Dev DApp</title>
        <meta name="description" content="The most advanced Web3 platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <h1>Welcome to Web3Dev DApp</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="nft-grid">
          {nfts.map((nft) => (
            <NFTCard key={nft._id} nft={nft} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;