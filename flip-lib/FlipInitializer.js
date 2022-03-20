import { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateBets, updatePendingBets, getBalance, initFlip } from ".";

const FlipInitializer = () => {
  //todo: connection and wallet should be params
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey !== null) {
      initFlip(wallet, connection);

      //50ms to have connection;
      setTimeout(() => {
        updateBets();
        updatePendingBets();
        getBalance();
      }, 50);

      //todo: we should refactor to events based if we even can?
      setInterval(() => {
        updateBets();
        updatePendingBets();
      }, 10_000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.publicKey]);

  return <></>;
};

export default FlipInitializer;
