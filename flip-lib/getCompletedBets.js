import { PublicKey } from "@solana/web3.js";
import { deserialize } from "borsh";
import { Bet } from "./classes/Bet";
import BN from "bn.js";

const getCompletedBets = async ({ connection, wallet, programId }) => {
  if (!connection) {
    return [];
  }
  const wonAccounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        dataSize: 82,
      },
      {
        memcmp: {
          offset: 1,
          bytes: wallet.publicKey.toString(),
        },
      },
    ],
  });

  const lostAccounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        dataSize: 82,
      },
      {
        memcmp: {
          offset: 33,
          bytes: wallet.publicKey.toString(),
        },
      },
    ],
  });

  const completedBets = [...wonAccounts, ...lostAccounts].reduce((total, a) => {
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

  const sortedCompleted = completedBets.sort((a, b) =>
    a.updated_at.lt(b.updated_at) ? 1 : -1
  );

  return sortedCompleted;
};

export default getCompletedBets;
