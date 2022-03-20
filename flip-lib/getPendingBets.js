import { PublicKey } from "@solana/web3.js";
import { deserialize } from "borsh";
import { Wager } from "./classes/Wager";
import BN from "bn.js";

// Gets all pending bets from platform
const getPendingBets = async ({ connection, programId }) => {
  const accounts = await connection.getProgramAccounts(programId, {
    filters: [{ dataSize: 81 }],
  });

  const pendingBets = accounts.reduce((total, a) => {
    const pending = deserialize(Wager.schema, Wager, a.account.data);
    return [
      ...total,
      {
        pubkey: a.pubkey,
        better: new PublicKey(pending.better),
        amount: new BN(pending.amount),
        updated_at: new BN(pending.updated_at),
      },
    ];
  }, []);

  const sortedPending = pendingBets.sort((a, b) => {
    return a.updated_at.lt(b.updated_at) ? 1 : -1;
  });

  return sortedPending;
};

export default getPendingBets;
