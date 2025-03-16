// This dApp is property of Web3Dev Strategy Consulting
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new ethers.BrowserProvider(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = await web3Instance.getSigner();
          const accounts = await web3Instance.listAccounts();
          setWeb3(web3Instance);
          setAccounts(accounts);
        } catch (error) {
          console.error('User denied account access', error);
        }
      } else if (window.web3) {
        const web3Instance = new ethers.providers.Web3Provider(window.web3.currentProvider);
        setWeb3(web3Instance);
        const accounts = await web3Instance.listAccounts();
        setAccounts(accounts);
      } else {
        console.error('No web3 provider detected');
      }
    };

    initWeb3();
  }, []);

  return { web3, accounts };
};

export default useWeb3;