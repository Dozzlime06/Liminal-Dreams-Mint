// src/pages/index.js
import { useWallets } from '@privy-io/react-auth';
import NFTMintingDApp from '../components/NFTMintingDApp';

export default function Home() {
  const { wallet, connectWallet } = useWallets();

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-2xl mb-4">Please connect your wallet first via Privy!</h1>
        <button
          onClick={connectWallet} // this will open embedded wallet UI
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <NFTMintingDApp wallet={wallet} />;
}
