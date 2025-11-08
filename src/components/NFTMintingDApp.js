import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

// Replace with your contract address
const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';

// Full NFT contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "owner","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "minter","type": "address"},
      {"internalType": "uint256","name": "quantity","type": "uint256"}
    ],
    "name": "mintSeaDrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function NFTMintingDApp() {
  const { wallet } = useWallets(); // Privy embedded wallet
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Setup ethers provider and contract when wallet is available
  useEffect(() => {
    if (wallet) {
      const provider = new ethers.providers.Web3Provider(wallet);
      setProvider(provider);

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider.getSigner()
      );
      setContract(nftContract);
    }
  }, [wallet]);

  // Fetch contract data
  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !wallet) return;
      try {
        const total = await contract.totalSupply();
        const max = await contract.maxSupply();
        const balance = await contract.balanceOf(wallet.address);
        setTotalSupply(total.toNumber());
        setMaxSupply(max.toNumber());
        setUserBalance(balance.toNumber());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [contract, wallet]);

  // Mint handler
  const handleMint = async () => {
    if (!contract || !wallet) return;
    setLoading(true);
    try {
      const tx = await contract.mintSeaDrop(wallet.address, mintQuantity);
      await tx.wait();
      alert('Mint successful!');
      // Refresh balance and total supply
      const total = await contract.totalSupply();
      const balance = await contract.balanceOf(wallet.address);
      setTotalSupply(total.toNumber());
      setUserBalance(balance.toNumber());
    } catch (err) {
      console.error(err);
      alert('Mint failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        <p>Please connect your wallet first via Privy!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">NFT Minting DApp</h1>
      <p>Total Supply: {totalSupply} / {maxSupply}</p>
      <p>Your Balance: {userBalance}</p>

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="number"
          min={1}
          max={maxSupply - totalSupply}
          value={mintQuantity}
          onChange={(e) => setMintQuantity(Number(e.target.value))}
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleMint}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          {loading ? 'Minting...' : 'Mint'}
        </button>
      </div>
    </div>
  );
}
