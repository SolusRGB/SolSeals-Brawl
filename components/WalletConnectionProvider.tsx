import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    // SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useMemo } from 'react';

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const network = 
        process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? WalletAdapterNetwork.Mainnet : 
        process.env.NEXT_PUBLIC_NETWORK === "testnet" ? WalletAdapterNetwork.Testnet :
        WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_NETWORK == "mainnet" ? process.env.NEXT_PUBLIC_CLUSTER_URL || "https://wild-wispy-meadow.solana-mainnet.quiknode.pro/aaa0d4e9392a33b143293ee971432cdd7f5cfe24/" : clusterApiUrl(network), [network]);
    
    //uncomment for localhost
    // const network = "http://localhost:8899"
    // const endpoint = network;

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            // new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
};
