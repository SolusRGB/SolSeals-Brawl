import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const getBalance = async ({ wallet, connection }) => {
  if (!wallet?.publicKey || !connection) {
    return;
  }
  const accountInfo = await connection.getAccountInfo(wallet.publicKey);
  return ((accountInfo?.lamports || 0) / LAMPORTS_PER_SOL).toFixed(2);
};

export default getBalance;
