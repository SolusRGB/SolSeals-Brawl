import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dialog } from "react-dialog-polyfill";
import { winMessages, lossMessages } from "../../scripts";
import Image from "next/image";

import { useDisplayBet, collect, closeDisplayBet } from "@rngstudio/flip";

const Message = ({ script }) => {
  const { side, message, icon } = script;

  if (side == "right") {
    return <></>
  }

  return (
    <section className={`message -${side}`}>
      {side === "left" && (
        <Image alt="Biker" src={icon} width={100} height={100} layout="fixed" />
      )}
      <div className={`nes-balloon from-${side}`}>
        <p>{message}</p>
      </div>
      {side === "right" && (
        <Image alt="Biker" src={icon} width={100} height={100} layout="fixed" />
      )}
    </section>
  );
};

const Collect = ({ enabled, pubkey, collect }) => {
  if (enabled) {
    return (
      <button className="nes-btn is-success" onClick={() => collect(pubkey)}>
        Collect
      </button>
    );
  }
  return (
    <button className="nes-btn is-disabled" disabled>
      Collect
    </button>
  );
};

const getArray = (isWinner) => {
  if (isWinner) {
    return winMessages;
  } else {
    return lossMessages;
  }
};

const randomScript = (isWinner) => {
  const array = getArray(isWinner);
  const scriptNumber = Math.floor(Math.random() * array.length);
  return array[scriptNumber];
};

export const WinLoss = () => {
  const wallet = useWallet();
  const [messageTimerDone, setMessageTimerDone] = useState(false);

  const bet = useDisplayBet();

  useEffect(() => {
    if (!!bet) {
      setMessageTimerDone(false);
      setTimeout(() => setMessageTimerDone(true), 14_000);
    }
  }, [bet]);

  if (!bet) {
    return (
      <Dialog
        open={false}
        onClose={closeDisplayBet}
        className="nes-dialog is-rounded"
      ></Dialog>
    );
  }

  const isWinner = wallet?.publicKey.toString() == bet.winner.toString();
  const messages = randomScript(isWinner);
  const collectEnabled = bet.collected === 0;

  const isVideo = messages.logo.substring(messages.logo.length - 4) === "webm";

  return (
    <Dialog open={true} onClose={close} className="nes-dialog is-rounded win-loss">
      <div className="winLossLogo">
        {!isVideo && (
          <Image
            src={messages.logo}
            width={200}
            height={200}
            layout="fixed"
            objectFit="cover"
            objectPosition="center"
            alt={isWinner ? "You won" : "You lost"}
          />
        )}
        {isVideo && (
          <>
          <video className="video" autoPlay={true} playsInline={true} muted>
            <source src={messages.logo} type="video/webm"/>
            <source src={messages.logo.replace('webm', 'm4v')} type="video/mp4"/>
          </video>
          </>
        )}
      </div>
      {messageTimerDone && (
        <div>
          <section className="message-list">
            {messages.script.map((script) => (
              <Message key={script.message} script={script} />
            ))}
          </section>
          {isWinner && (
            <Collect
              enabled={collectEnabled}
              pubkey={bet.pubkey}
              close={closeDisplayBet}
              collect={() => collect(bet.pubkey)}
            />
          )}
          <button className="nes-btn" onClick={closeDisplayBet}>
            Close
          </button>
        </div>
      )}
    </Dialog>
  );
};
