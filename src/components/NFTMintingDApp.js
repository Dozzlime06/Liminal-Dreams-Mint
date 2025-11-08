import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
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
    "inputs": [{"internalType": "address","name":"owner","type":"address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name":"minter","type":"address"},
      {"internalType": "uint256","name":"quantity","type":"uint256"}
    ],
    "name": "mintSeaDrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name":"tokenId","type":"uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function NFTMintingDApp() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  const [contractName, setContractName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const walletAddress = wallets?.[0]?.address || null;

  useEffect(() => {
    if (!walletAddress) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    async function fetchData() {
      try {
        const [nameRes, symbolRes, totalRes, maxRes] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.maxSupply()
        ]);

        setContractName(nameRes);
        setSymbol(symbolRes);
        setTotalSupply(totalRes.toString());
        setMaxSupply(maxRes.toString());
      } catch (err) {
        console.error('Contract read error:', err);
      }
    }

    fetchData();
  }, [walletAddress]);

  const handleMint = async () => {
    if (!walletAddress) {
      alert('Connect wallet first!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mintSeaDrop(walletAddress, 1);
      await tx.wait();

      alert('Minted successfully!');
    } catch (err) {
      console.error('Mint error:', err);
      alert('Mint failed. Check console.');
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        Loading DApp...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">{contractName || 'NFT Mint DApp'}</h1>
      <p className="mb-2">Symbol: {symbol || '-'}</p>
      <p className="mb-2">Total Minted: {totalSupply} / {maxSupply}</p>

      <button
        className="mt-4 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition"
        onClick={handleMint}
      >
        Mint NFT
      </button>
    </div>
  );
}
