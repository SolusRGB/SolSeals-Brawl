import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fromUnixTime, formatRelative } from "date-fns";
import { usePendingBets } from "@rngstudio/flip";

const PendingBet = ({ bet }) => {
  return (
    <tr>
      <td>{bet.amount / LAMPORTS_PER_SOL}</td>
      <td className="no-mobile">
        {formatRelative(fromUnixTime(bet.updated_at), new Date())}
      </td>
    </tr>
  );
};

export const PendingBets = ({ bets = [] }) => {
  const wallet = useWallet();
  const pendingBets = usePendingBets();

  const myPendingBets = pendingBets.filter(
    (bet) => bet.better.toString() === wallet?.publicKey.toString()
  );

  if (myPendingBets.length === 0) {
    return <></>;
  }

  return (
    <div className="nes-container with-title is-centered is-rounded">
      <p className="title">Your pending bets</p>
      These are bets that are waiting for another person to bet.
      <div className="nes-table-responsive pending-box">
        <table className="nes-table is-wide">
          <thead>
            <tr>
              <th>Amount</th>
              <th className="no-mobile">When</th>
            </tr>
          </thead>
          <tbody>
            {myPendingBets.map((bet) => (
              <PendingBet key={bet.pubkey} bet={bet} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
