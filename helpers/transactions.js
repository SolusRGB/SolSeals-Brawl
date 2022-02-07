import { Transaction } from "@solana/web3.js";

export const setPayerAndBlockhashTransaction = async (
  instructions,
  wallet,
  connection
) => {
  const transaction = new Transaction();
  instructions.forEach((element) => {
    transaction.add(element);
  });
  transaction.feePayer = wallet.publicKey;
  const hash = await connection.getRecentBlockhash();
  transaction.recentBlockhash = hash.blockhash;
  return transaction;
};

export const signAndSendTransaction = async (
  transaction,
  wallet,
  connection
) => {
    let signedTrans = await wallet.signTransaction(transaction);
    let signature = await connection.sendRawTransaction(
      signedTrans.serialize()
    );
    return signature;
};
