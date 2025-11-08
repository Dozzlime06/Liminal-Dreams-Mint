import dynamic from 'next/dynamic';
import Head from 'next/head';

const NFTMintingDApp = dynamic(
  () => import('../components/NFTMintingDApp'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Minting DApp</title>
        <meta name="description" content="Mint your NFT on Base Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NFTMintingDApp />
    </>
  );
}
