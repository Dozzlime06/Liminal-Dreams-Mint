// src/components/NFTMintingDApp.js
import React, { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const CONTRACT_ABI = [
  // Full ABI here
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"address","name":"owner","type":"address"}],
    "name": "balanceOf",
    "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
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
  const { wallet, login } = useWallets();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) {
      const prov = new ethers.providers.Web3Provider(wallet);
      setProvider(prov);
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov.getSigner());
      setContract(nftContract);

      // fetch totalSupply and maxSupply
      (async () => {
        try {
          const total = await nftContract.totalSupply();
          const max = await nftContract.maxSupply();
          setTotalSupply(total.toString());
          setMaxSupply(max.toString());
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [wallet]);

  const handleMint = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.mintSeaDrop(wallet.address, mintQuantity);
      await tx.wait();
      alert('Minted successfully!');
      const total = await contract.totalSupply();
      setTotalSupply(total.toString());
    } catch (err) {
      console.error(err);
      alert('Mint failed: ' + err.message);
    }
    setLoading(false);
  };

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-900">
        <p className="text-xl">Please connect your wallet first via Privy!</p>
        <button
          onClick={() => login({ method: 'wallet' })}
          className="mt-4 px-6 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">NFT Minting DApp</h1>
      <p>Total Supply: {totalSupply} / {maxSupply}</p>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={mintQuantity}
          onChange={(e) => setMintQuantity(Number(e.target.value))}
          className="px-2 py-1 rounded text-black"
        />
        <button
          onClick={handleMint}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
}
