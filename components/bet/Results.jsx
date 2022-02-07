import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fromUnixTime, formatRelative } from "date-fns";

const Result = ({ bet, collect }) => {
  const wallet = useWallet();
  const isWinner = wallet?.publicKey.toString() == bet.winner.toString();
  const collectEnabled = bet.collected === 0 && isWinner;
  return (
    <tr>
      <td>{isWinner ? "Yes" : "No"}</td>
      <td className="trim">{isWinner ? bet.loser.toString() : bet.winner.toString()}</td>
      <td>{bet.amount / LAMPORTS_PER_SOL}</td>
      <td>{formatRelative(fromUnixTime(bet.updated_at), new Date())}</td>
      <td>
        {collectEnabled ? (
          <button
            className="nes-btn is-success"
            onClick={() => collect(bet.pubkey)}
          >
            Collect
          </button>
        ) : (
          <button className="nes-btn is-disabled" disabled>
            Collect
          </button>
        )}
      </td>
    </tr>
  );
};

export const Results = ({ bets, collect }) => {
  const wallet = useWallet();

  return (
    <div className="nes-container with-title is-centered is-dark is-rounded">
      <p className="title">Your results</p>
      <div className="nes-table-responsive">
        <table className="nes-table is-dark is-wide">
          <thead>
            <tr>
              <th>Won?</th>
              <th>Against</th>
              <th>Amount</th>
              <th>When</th>
              <th>Collect</th>
            </tr>
          </thead>
          <tbody>
            {/* todo: filter where winner or loser is you */}
            {bets
              .filter((bet) =>
                [bet.winner.toString(), bet.loser.toString()].includes(
                  wallet?.publicKey.toString()
                )
              )
              .map((bet) => (
                <Result key={bet.pubkey} bet={bet} collect={collect} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
