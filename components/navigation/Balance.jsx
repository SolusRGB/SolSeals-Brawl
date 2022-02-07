import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const Balance = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (wallet?.publicKey && connection) {
      getBalance();
    }
    //todo: have this react to redux state;
    setInterval(getBalance, 15000);
  }, [wallet?.publicKey, connection]);

  const getBalance = async () => {
    if (!wallet?.publicKey || !connection) {
      return;
    }
    const accountInfo = await connection.getAccountInfo(wallet.publicKey);
    setBalance((accountInfo.lamports / LAMPORTS_PER_SOL).toFixed(2));
  };
  
  if (!wallet.publicKey) {
    return <div></div>
  }

  return (
    <div className="wallet-adapter-dropdown">
      <button type="button" className="wallet-adapter-button nes-btn is-success sol-coin">
        {balance} SOL
      </button>
    </div>
  );
};

//<WalletMultiButton />
