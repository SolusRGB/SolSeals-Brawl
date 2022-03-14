import { Argument } from "./classes/Argument";
import { serialize } from "borsh";
import { TransactionInstruction } from "@solana/web3.js";

import {
  setPayerAndBlockhashTransaction,
  signAndSendTransaction,
} from "./helpers/transactions";

const collect = async (betPubkey, { wallet, connection, programId }) => {
  const withdraw = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true },
      { pubkey: betPubkey, isSigner: false, isWritable: true },
    ],
    programId: programId,
    data: serialize(Argument.schema, new Argument({ type: 2, amount: 0 })),
  });

  const trans = await setPayerAndBlockhashTransaction(
    [withdraw],
    wallet,
    connection
  );
  const signature = await signAndSendTransaction(trans, wallet, connection);
  const result = await connection.confirmTransaction(signature);
};

export default collect;
