import { useEffect, useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction
} from "@solana/web3.js";
import { Wager } from "../../classes/Wager";
import { Bet } from "../../classes/Bet";
import { Argument } from "../../classes/Argument";
import { deserialize, serialize } from "borsh";
import { BetBox } from "./BetBox";
import { PendingBets } from "./PendingBets";
import { Results } from "./Results";
import { Error } from "./Error";
import { WinLoss } from "./WinLoss";
import { Disclaimer } from './Disclaimer';
import {
  setPayerAndBlockhashTransaction,
  signAndSendTransaction,
} from "../../helpers/transactions";
import BN from "bn.js";
import { useCookies } from "react-cookie";

//todo: move these back into scope to useEffect
const programId = new PublicKey("E23xuZVzpEGKjiRtFjiT1BC1N3MqvZuvULXVi44uEKnN");
const partner = new PublicKey("5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5");
const oracle = new PublicKey(
  "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"
  // "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB" //mainnet
);
const fee = new PublicKey("BztEHBnWKkHGhejpszVPL6zrTBKo5ELR42x1URK5fVh1");

export const Main = () => {
  const { connection } = useConnection();
  const [cookies, setCookie] = useCookies(['agreedToDisclaimer']);
  const wallet = useWallet();
  const [pendingBets, setPendingBets] = useState([]);
  const [bets, setBets] = useState([]);
  const betsRef = useRef(bets);
  const pendingBetsRef = useRef(pendingBets);
  const [betsDirty, setBetsDirty] = useState(false);
  const betsDirtyRef = useRef(betsDirty);
  betsRef.current = bets;
  pendingBetsRef.current = pendingBets;
  betsDirtyRef.current = betsDirty;

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorType, setErrorType] = useState("insufficientFunds");
  const [winLossBet, setWinLossBet] = useState();

  useEffect(() => {
    if (wallet.publicKey !== null) {
      getPendingBets();
      getCompletedBets();
      setInterval(getPendingBets, 10000);
      setInterval(getCompletedBets, 5000);
    }
  }, [wallet?.publicKey]);

  const getPendingBets = async () => {
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
      a.updated_at.lt(b.updated_at) ? 1 : -1
    }
    );

    if (
      getTimeCount(pendingBetsRef.current) !== getTimeCount(pendingBets) ||
      (pendingBetsRef.current.length === 0 && pendingBets.length > 0)
    ) {
      setPendingBets(sortedPending);
    }

    return sortedPending;
  };

  const getCompletedBets = async () => {
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
      if (Boolean(total.find(dup => dup.pubkey.toString() === a.pubkey.toString()))) {
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

    if (sortedCompleted.length > betsRef.current.length) {
      if (sortedCompleted[0].collected === 0) {
        setWinLossBet(sortedCompleted[0]);
      }
    }

    if (
      betsDirtyRef.current ||
      getTimeCount(betsRef.current) !== getTimeCount(sortedCompleted) ||
      (betsRef.current.length === 0 && sortedCompleted.length > 0)
    ) {
      setBetsDirty(false);
      setBets(sortedCompleted);
      await getPendingBets();
    }
  };

  const getTimeCount = (array) => {
    return array
      .reduce((total, a) => total.add(a.updated_at), new BN(0))
      .toString();
  };

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

  const getPendingBet = (index, amount) => {
    const pendingByAmount = pendingBets
      .filter(
        (bet) =>
          bet.amount.eq(amount) &&
          wallet?.publicKey.toString() !== bet.better.toString()
      )
      .reverse();
    const pendingBet = pendingByAmount[index];
    if (pendingBet) {
      return { pubkey: pendingBet.pubkey, isSigner: false, isWritable: true };
    } else {
      //return a fill
      return { pubkey: wallet.publicKey, isSigner: false, isWritable: true };
    }
  };

  const createBet = async (amount) => {
    const { betAccount, createBetAccount } = await generateBets();
    const { wagerAccount, createWagerAccount } = await generateWagers(amount);

    await getPendingBets();

    const betTransaction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true }, //
        { pubkey: betAccount, isSigner: false, isWritable: true },
        { pubkey: wagerAccount, isSigner: false, isWritable: true },
        { pubkey: fee, isSigner: false, isWritable: true },
        { pubkey: partner, isSigner: false, isWritable: true },
        { pubkey: oracle, isSigner: false, isWritable: false }, 
        getPendingBet(0, amount),
        getPendingBet(1, amount),
        getPendingBet(2, amount),
        getPendingBet(3, amount),
      ],
      programId: programId,
      data: serialize(
        Argument.schema,
        new Argument({
          type: 3,
          amount: amount,
        })
      ),
    });

    const trans = await setPayerAndBlockhashTransaction(
      [createBetAccount, createWagerAccount, betTransaction],
      wallet,
      connection
    );
    try {
      const signature = await signAndSendTransaction(trans, wallet, connection);
      const result = await connection.confirmTransaction(signature);
    } catch (e) {
      if (e.logs) {
        for (const message of e.logs) {
          if (message.includes("insufficient lamports")) {
            setErrorOpen(true);
            setErrorType("insufficientFunds");
            return;
          }
        }
      }
      if (e.message.includes("User rejected the request.")) {
        //user has backed out.
        setErrorOpen(true);
        setErrorType("userCancel");
      }
    }
    await getPendingBets();
  };

  const collect = async (betPubkey) => {
    const withdraw = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true },
        { pubkey: betPubkey, isSigner: false, isWritable: true },
      ],
      programId: programId,
      data: serialize(Argument.schema, new Argument({ type: 2, amount: 0 })),
    });

    try {
    const trans = await setPayerAndBlockhashTransaction(
      [withdraw],
      wallet,
      connection
    );
    const signature = await signAndSendTransaction(trans, wallet, connection);
    const result = await connection.confirmTransaction(signature);
    setWinLossBet(undefined);
    setBetsDirty(true);
    getCompletedBets();
    } catch (e) {
      if (e.logs) {
        for (const message of e.logs) {
          if (message.includes("program has already been collected")) {
            setWinLossBet(undefined);
            setErrorOpen(true);
            setErrorType("alreadyWithdrawn");
            return;
          }
        }
      }
    }
  };

  if (
    !wallet ||
    !wallet.publicKey 
  ) {
    return <>Please connect your wallet</>;
  }

  return (
    <>
      <>
        <Disclaimer isOpen={!cookies.agreedToDisclaimer} close={() => setCookie('agreedToDisclaimer', true)}></Disclaimer>
        <Error
          isOpen={errorOpen}
          type={errorType}
          closeError={() => setErrorOpen(false)}
        />
        <WinLoss
          bet={winLossBet}
          close={() => setWinLossBet(undefined)}
          collect={collect}
        />
        <BetBox createBet={createBet} pendingBets={pendingBets} />
        <PendingBets bets={pendingBets} />
        <Results bets={bets} collect={collect} />
      </>
    </>
  );
};
