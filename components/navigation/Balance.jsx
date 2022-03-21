import { useBalance } from "@rngstudio/flip";
import { useWallet } from "@solana/wallet-adapter-react";

export const Balance = () => {
  const balance = useBalance();
  const wallet = useWallet();

  if (!wallet.publicKey) {
    return <div></div>;
  }

  return (
    <div className="wallet-adapter-dropdown">
      <button
        type="button"
        className="wallet-adapter-button nes-btn is-success sol-coin"
      >
        {balance} SOL
      </button>
    </div>
  );
};
