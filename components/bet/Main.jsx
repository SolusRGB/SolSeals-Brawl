import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BetBox } from "./BetBox";
import { PendingBets } from "./PendingBets";
import { Stats } from "./Stats";
import { Results } from "./Results";
import { Error } from "./Error";
import { WinLoss } from "./WinLoss";
import { Welcome } from "./Welcome";
import { Disclaimer } from "./Disclaimer";
// import { whitelist } from "../../whitelist";
import { useCookies } from "react-cookie";
import { FlipInitializer } from "../../flip-lib";

export const Main = () => {
  const [cookies, setCookie] = useCookies(["agreedToDisclaimer"]);
  const wallet = useWallet();
  const [winLossBet, setWinLossBet] = useState();

  if (!wallet || !wallet.publicKey) {
    return <Welcome />;
  }

  return (
    <>
      <FlipInitializer />
      <Disclaimer
        isOpen={!cookies.agreedToDisclaimer}
        close={() => setCookie("agreedToDisclaimer", true)}
      ></Disclaimer>
      <Error />
      <WinLoss
        bet={winLossBet}
        close={() => setWinLossBet(undefined)}
        // collect={collect}
      />
      <BetBox />
      <PendingBets />
      <Stats />
      <Results />
    </>
  );
};
