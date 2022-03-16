import * as React from "react";
import getCompletedBets from "./getCompletedBets";
import { PublicKey } from "@solana/web3.js";
import getPendingBets from "./getPendingBets";
import _createBet from "./createBet";
import _getBalance from "./getBalance";
import collectWinnings from "./collectWinnings";
import FlipInitializer from "./FlipInitializer";
import getTimeCount from "./getTimeCount";

const FlipContext = React.createContext();

const defaultState = {
  bets: [],
  pendingBets: [],
  balance: 0.0,
  // programId: new PublicKey("E23xuZVzpEGKjiRtFjiT1BC1N3MqvZuvULXVi44uEKnN"), //todo: we should probably hardcode
  programId: new PublicKey("E23xuZVzpEGKjiRtFjiT1BC1N3MqvZuvULXVi44uEKnN"),
  partnerId: "",
  displayBet: undefined,
  error: undefined,
  loading: false,
  seenBets: [], //todo, we should get these from storage?
  initialLoad: true,
};

let state, dispatch;

function flipReducer(state, action) {
  //todo: we can extract reducers out
  switch (action.type) {
    case "initFlip": {
      return { ...state, wallet: action.wallet, connection: action.connection };
    }
    case "setCompletedBets": {
      return { ...state, bets: action.bets };
    }
    case "setPendingBets": {
      return { ...state, pendingBets: action.pendingBets };
    }
    case "setBalance": {
      return { ...state, balance: action.balance };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
    case "startLoading": {
      return { ...state, loading: true };
    }
    case "stopLoading": {
      return { ...state, loading: false };
    }
    case "setError": {
      return { ...state, error: action.error };
    }
    case "setDisplayBet": {
      const displayBet = action.displayBet;
      if (!!state.displayBet && !!action.displayBet) {
        //only allow one display bet per
        return state;
      }
      if (!displayBet || displayBet.collected !== 0) {
        return { ...state, displayBet: undefined, initialLoad: false };
      }
      const key = displayBet.pubkey.toString();
      if (!state.seenBets.includes(key)) {
        return {
          ...state,
          displayBet,
          seenBets: [state.seenBets, key],
          initialLoad: false,
        };
      }
      return state;
    }
    case "turnOffInitialLoad": {
      return { ...state, initialLoad: false };
    }
  }
}

function FlipProvider({ children, partnerId, network }) {
  const oracleId =
    network === "mainnet"
      ? new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG")
      : network === "testnet"
      ? new PublicKey("7VJsBtJzgTftYzEeooSDYyjKXvYRWJHdwvbwfBvTg9K")
      : new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

  const [_state, _dispatch] = React.useReducer(flipReducer, {
    ...defaultState,
    partnerId: new PublicKey(partnerId),
    oracleId,
  });
  state = _state;
  dispatch = _dispatch;
  return (
    <FlipContext.Provider value={{ state, dispatch }}>
      {children}
    </FlipContext.Provider>
  );
}

function useFlip() {
  const context = React.useContext(FlipContext);
  if (context === undefined) {
    throw new Error("useFlip must be used within a FlipProvider");
  }
  return context;
}

function useBets() {
  return useFlip().state.bets;
}

function usePendingBets() {
  return useFlip().state.pendingBets;
}

function useBalance() {
  return useFlip().state.balance;
}

function useError() {
  return useFlip().state.error;
}

function useDisplayBet() {
  return useFlip().state.displayBet;
}

function useLoading() {
  return useFlip().state.loading;
}

async function updateBets(override = false) {
  const bets = await getCompletedBets(state);
  if (
    override ||
    getTimeCount(state.bets) !== getTimeCount(bets) ||
    (state.bets.length === 0 && bets.length > 0)
  ) {
    dispatch({ type: "setCompletedBets", bets });

    if (!state.initialLoad) {
      // don't show on initial load (instead of saving, prevents us from multi popups);
      dispatch({ type: "setDisplayBet", displayBet: bets[0] });
    }
  }
}

async function updatePendingBets() {
  //todo: figureout how to make this into a custom hook?
  const pendingBets = await getPendingBets(state);
  if (
    getTimeCount(state.pendingBets) !== getTimeCount(pendingBets) ||
    (state.pendingBets.length === 0 && pendingBets.length > 0)
  ) {
    dispatch({ type: "setPendingBets", pendingBets });
  }
}

async function createBet(amount) {
  dispatch({ type: "turnOffInitialLoad" });
  const pendingBets = await getPendingBets(state);
  dispatch({ type: "startLoading" });
  try {
    await _createBet(amount, { ...state, pendingBets });
    updatePendingBets(dispatch, state);
    getBalance(state, dispatch);
    dispatch({ type: "stopLoading" });
  } catch (e) {
    if (e.logs) {
      for (const message of e.logs) {
        if (message.includes("insufficient lamports")) {
          dispatch({ type: "setError", error: "insufficientFunds" });
          dispatch({ type: "stopLoading" });
          return;
        }
      }
    }
    if (e.message.includes("User rejected the request.")) {
      //user has backed out.
      dispatch({ type: "setError", error: "userCancel" });
      dispatch({ type: "stopLoading" });
    }
  }
}

async function collect(betPubkey) {
  try {
    dispatch({ type: "startLoading" });
    await collectWinnings(betPubkey, state);
  } catch (e) {
    if (e.logs) {
      for (const message of e.logs) {
        if (message.includes("program has already been collected")) {
          dispatch({ type: "setError", error: "alreadyWithdrawn" });
        }
      }
    }
  }
  updateBets(true);
  getBalance();
  dispatch({ type: "setDisplayBet", displayBet: undefined });
  dispatch({ type: "stopLoading" });
}

async function getBalance() {
  const balance = await _getBalance(state);
  dispatch({ type: "setBalance", balance });
}

function initFlip(wallet, connection) {
  dispatch({ type: "initFlip", wallet, connection });
}

function closeError() {
  dispatch({ type: "setError", error: undefined });
}

function closeDisplayBet() {
  dispatch({ type: "setDisplayBet", displayBet: undefined });
}

export {
  FlipProvider,
  // useFlip,
  useBets,
  usePendingBets,
  useBalance,
  updateBets,
  updatePendingBets,
  useError,
  useDisplayBet,
  useLoading,
  initFlip,
  createBet,
  collect,
  getBalance,
  closeError,
  closeDisplayBet,
  FlipInitializer,
};
