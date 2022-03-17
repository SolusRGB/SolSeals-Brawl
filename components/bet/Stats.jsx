import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useBets } from "../../flip-lib";

export const Stats = () => {
  const wallet = useWallet();
  const key = wallet.publicKey.toString();
  const bets = useBets();

  if (!bets || bets.length == 0) {
    return <></>
  }

  const total = bets?.length;
  const wins = bets.filter(
    (bet) => bet.winner.toString() === key
  ).length;
  const totalWl = bets.reduce((total, bet) => {
    if (bet.winner.toString() === key) {
      total += ( bet.amount.toNumber() / LAMPORTS_PER_SOL);
    } else {
      total -= (bet.amount.toNumber() / LAMPORTS_PER_SOL);
    }
    return total;
  }, 0)
  const losses = total - wins;
  let streak = 0;

  for (const bet of bets) {
      if (bet.winner.toString() === key) {
          streak = streak + 1;
      } else {
          break;
      }
  }

  return (
    <div className="nes-container with-title is-centered is-rounded">
      <p className="title">Your stats</p>
      <div className="nes-table-responsive">
        Streak: {streak}<br/>
        Bets: {total}<br/>
        Wins: {wins}<br />
        Losses: {losses}<br />
        Percent: {Math.round((wins / total) * 100)}%<br/>
        Total Won/Lost: {totalWl.toFixed(2)} SOL
      </div>
    </div>
  );
};
