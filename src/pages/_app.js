// src/pages/_app.js
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6',
          logo: 'https://auth.privy.io/logos/privy-logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'always', // <-- use 'always' to force wallet creation for testing
          noPromptOnSignature: false,
        },
        defaultChain: base,
        supportedChains: [base],
        // optional: only needed if using WalletConnect Cloud
        // walletConnectCloudProjectId: 'your-walletconnect-project-id',
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default MyApp;
