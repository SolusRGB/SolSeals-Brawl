import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Bet } from "@rngstudio/flip/classes/Bet";
import { deserialize } from "borsh";
import BN from "bn.js";

//todo: move these back into scope to useEffect
const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
export const Stats = () => {
  const { connection } = useConnection();
  const [allBets, setAllBets] = useState([]);
  const [byWallet, setByWallet] = useState({});

  useEffect(() => {
    getAllBets();
  }, []);

  const getAllBets = async () => {
    const bets = await connection.getProgramAccounts(programId, {
      filters: [
        {
          dataSize: 82,
        },
      ],
    });

    const theBets = bets.reduce((total, a) => {
      const completed = deserialize(Bet.schema, Bet, a.account.data);
      if (
        Boolean(
          total.find((dup) => dup.pubkey.toString() === a.pubkey.toString())
        )
      ) {
        return total;
      }

      return [
        ...total,
        {
          pubkey: a.pubkey,
          winner: new PublicKey(completed.winner),
          loser: new PublicKey(completed.loser),
          amount: new BN(completed.amount),
          collected: completed.collected,
          updated_at: new BN(completed.updated_at),
        },
      ];
    }, []);

    const groupedByWallet = theBets.reduce((total, a) => {
      total[a.winner.toString()] = [...(total[a.winner.toString()] || []), a];
      total[a.loser.toString()] = [...(total[a.loser.toString()] || []), a];
      return total;
    }, {});

    setByWallet(groupedByWallet);
    setAllBets(theBets);
  };

  if (allBets.length === 0) {
    return (
      <div className="nes-container is-dark with-title is-centered is-rounded">
        <p className="title">Stats</p>
        We are loading the stats. This may take a long time...
      </div>
    );
  }

  return (
    <div className="nes-container is-dark with-title is-centered is-rounded">
      <p className="title">Stats</p>
      Total bets {allBets.length}
      <div className="nes-table-responsive">
        <table className="nes-table is-dark is-wide">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Bets</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Percent</th>
              <th>SOL W/L</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(byWallet).map((key) => {
              const bets = byWallet[key];
              const total = bets.length;
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

              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td className="trim">{bets.length}</td>
                  <td>{wins}</td>
                  <td>{losses}</td>
                  <td>{Math.round((wins / total) * 100)}%</td>
                  <td>{totalWl.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
