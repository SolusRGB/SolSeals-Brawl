import { Bet } from "./classes/Bet";
import { Wager } from "./classes/Wager";
import { Argument } from "./classes/Argument";
import { serialize } from "borsh";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import getPendingBet from "./getPendingBet";
import {
  setPayerAndBlockhashTransaction,
  signAndSendTransaction,
} from "./helpers/transactions";

const fee = new PublicKey("BztEHBnWKkHGhejpszVPL6zrTBKo5ELR42x1URK5fVh1");

const createBet = async (amount, state) => {
  const { connection, wallet, pendingBets, programId, partnerId, oracleId } = state;
  const generateBets = async () => {
    const bet = new Bet({
      type: 1,
      winner: wallet.publicKey.toBuffer(),
      loser: wallet.publicKey.toBuffer(),
      amount: 0,
      collected: 0,
      updated_at: 0,
    });

    const data = serialize(Bet.schema, bet);

    //fund with minimum lamports to make rent exempt:
    const minRent = await connection.getMinimumBalanceForRentExemption(
      data.length
    );

    const BET_SEED = "betAccount" + Math.random().toString();
    const betAccount = await PublicKey.createWithSeed(
      wallet.publicKey,
      BET_SEED,
      programId
    );

    const createBetAccount = SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey,
      basePubkey: wallet.publicKey,
      seed: BET_SEED,
      newAccountPubkey: betAccount,
      lamports: minRent, //so it stays alive on the chain
      space: data.length,
      programId,
    });

    return { betAccount, createBetAccount };
  };

  const generateWagers = async (amount) => {
    const calculatedFees = amount.divn(100).muln(2);
    const amountWithFee = amount.add(calculatedFees);

    const wager = new Wager({
      type: 1,
      better: wallet.publicKey.toBuffer(),
      bet: wallet.publicKey.toBuffer(),
      amount,
      updated_at: 0,
    });

    const data = serialize(Wager.schema, wager);

    const WAGER_SEED = "wagerAccount" + Math.random().toString();
    const wagerAccount = await PublicKey.createWithSeed(
      wallet.publicKey,
      WAGER_SEED,
      programId
    );

    const createWagerAccount = SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey,
      basePubkey: wallet.publicKey,
      seed: WAGER_SEED,
      newAccountPubkey: wagerAccount,
      lamports: amountWithFee,
      space: data.length,
      programId,
    });

    return { wagerAccount, createWagerAccount };
  };
  const { betAccount, createBetAccount } = await generateBets();
  const { wagerAccount, createWagerAccount } = await generateWagers(amount);

  const betTransaction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true }, //
      { pubkey: betAccount, isSigner: false, isWritable: true },
      { pubkey: wagerAccount, isSigner: false, isWritable: true },
      { pubkey: fee, isSigner: false, isWritable: true },
      ...(partnerId !== '' ? [{ pubkey: partnerId, isSigner: false, isWritable: true }] : []),
      { pubkey: oracleId, isSigner: false, isWritable: false },
      getPendingBet(pendingBets, wallet, 0, amount),
      getPendingBet(pendingBets, wallet, 1, amount),
      getPendingBet(pendingBets, wallet, 2, amount),
      getPendingBet(pendingBets, wallet, 3, amount),
    ],
    programId: programId,
    data: serialize(
      Argument.schema,
      new Argument({
        type: partnerId !== '' ? 3 : 1,
        amount: amount,
      })
    ),
  });

  const trans = await setPayerAndBlockhashTransaction(
    [createBetAccount, createWagerAccount, betTransaction],
    wallet,
    connection
  );
    const signature = await signAndSendTransaction(trans, wallet, connection);
    await connection.confirmTransaction(signature);
};

export default createBet;