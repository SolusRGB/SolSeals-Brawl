import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import BN from "bn.js";
import { usePendingBets, createBet } from "../../flip-lib";

export const BetBox = () => {
  const pendingBets = usePendingBets();
  const [betAmount, setBetAmount] = useState(25);
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const BetRadio = ({ betAmount, selectAmount, isInstant }) => {
    const instant = isInstant && <span className="instant">instant</span>;
    const checked = Number(selectAmount) === Number(betAmount);
    if (checked) {
      return (
        <>
          <label>
            <input
              type="radio"
              className="nes-radio is-dark is-primary"
              value={selectAmount}
              checked
              onChange={() => {}}
            />
            <span className="bet">
              {selectAmount / 100} SOL
              {instant}
            </span>
          </label>
        </>
      );
    }
    return (
      <label>
        <input
          type="radio"
          className={`nes-radio is-dark ${checked ? "is-primary" : ""}`}
          value={selectAmount}
        />
        <span className="bet">
          {selectAmount / 100} SOL
          {instant}
        </span>
      </label>
    );
  };

  const amount = new BN(LAMPORTS_PER_SOL).divn(100).muln(Number(betAmount));
  const instants = pendingBets.reduce(
    (total, bet) => {
      for (const i of [5, 10, 25, 50, 100]) {
        if (
          bet.amount.eq(new BN(LAMPORTS_PER_SOL).divn(100).muln(Number(i))) &&
          bet.better.toString() !== wallet.publicKey.toString()
        ) {
          return { ...total, [i]: true };
        }
      }
      return total;
    },
    { 5: false, 10: false, 25: false, 50: false, 100: false }
  );

  return (
    <div className="nes-container with-title is-centered is-rounded is-dark">
      <p className="title">Bet</p>
      <p>
        Pick an amount and bet. BANANOS MC Gang takes a 2% cut of the bet. You
        will be matched up with the next person who bets that amount
      </p>
      <div>
        <div onChange={(e) => setBetAmount(e.target.value)}>
          <BetRadio
            selectAmount={5}
            betAmount={betAmount}
            isInstant={instants[5]}
          />
          <BetRadio
            selectAmount={10}
            betAmount={betAmount}
            isInstant={instants[10]}
          />
          <BetRadio
            selectAmount={25}
            betAmount={betAmount}
            isInstant={instants[25]}
          />
          <BetRadio
            selectAmount={50}
            betAmount={betAmount}
            isInstant={instants[50]}
          />
          <BetRadio
            selectAmount={100}
            betAmount={betAmount}
            isInstant={instants[100]}
          />
        </div>


        <button
          type="button"
          className={`nes-btn ${loading && 'is-disabled'}`}
          onClick={async () => {
            setLoading(true); 
            await createBet(amount);
            setLoading(false);
          }}
          disabled={loading}
        >
          Bet
        </button>
      </div>
    </div>
  );
};
