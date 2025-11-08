import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"minter","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"}],
    "name":"mintSeaDrop",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],
    "name":"tokenURI",
    "outputs":[{"internalType":"string","name":"","type":"string"}],
    "stateMutability":"view",
    "type":"function"
  }
];

export default function NFTMintingDApp() {
  const { user, wallet, loading } = usePrivy();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [minting, setMinting] = useState(false);

  // Initialize provider and contract once wallet is ready
  useEffect(() => {
    if (wallet) {
      const ethersProvider = new ethers.BrowserProvider(wallet); // browser provider from ethers
      setProvider(ethersProvider);

      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethersProvider.getSigner());
      setContract(nftContract);
    }
  }, [wallet]);

  // Fetch basic contract info
  useEffect(() => {
    if (!contract) return;
    const fetchData = async () => {
      try {
        setName(await contract.name());
        setSymbol(await contract.symbol());
        setTotalSupply((await contract.totalSupply()).toString());
        setMaxSupply((await contract.maxSupply()).toString());
      } catch (err) {
        console.error('Error fetching contract data:', err);
      }
    };
    fetchData();
  }, [contract]);

  const handleMint = async () => {
    if (!contract) return;
    setMinting(true);
    try {
      const tx = await contract.mintSeaDrop(wallet.address, 1); // mint 1 NFT
      await tx.wait();
      alert('Mint successful!');
      setTotalSupply((prev) => parseInt(prev) + 1);
    } catch (err) {
      console.error('Mint error:', err);
      alert('Mint failed. See console.');
    } finally {
      setMinting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading Privy...</div>;
  if (!user) return <div className="text-center p-8">Please log in to mint NFT</div>;

  return (
    <div className="max-w-xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">{name} ({symbol})</h1>
      <p className="mb-2">Total Supply: {totalSupply} / {maxSupply}</p>
      <p className="mb-4">Logged in as: {user.email || user.walletAddress}</p>
      <button
        onClick={handleMint}
        disabled={minting || parseInt(totalSupply) >= parseInt(maxSupply)}
        className="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {minting ? 'Minting...' : 'Mint 1 NFT'}
      </button>
    </div>
  );
}
