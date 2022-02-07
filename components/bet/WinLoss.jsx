import { useWallet } from "@solana/wallet-adapter-react";
import { Dialog } from "react-dialog-polyfill";
import { winMessages, lossMessages } from "../../scripts";
import Image from 'next/image';

const Message = ({ script }) => {
  const { side, message, icon } = script;

  return (
    <section className={`message -${side}`}>
      {side === "left" && <Image alt="Biker" src={icon} width={100} height={100} layout="fixed" />}
      <div className={`nes-balloon from-${side}`}>
        <p>{message}</p>
      </div>
      {side === "right" && <Image alt="Biker" src={icon} width={100} height={100} layout="fixed" />}
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

export const WinLoss = ({ bet, close, collect }) => {
  const wallet = useWallet();
  if (!bet) {
    return (
      <Dialog
        open={false}
        onClose={close}
        className="nes-dialog is-rounded"
      ></Dialog>
    );
  }

  const isWinner = wallet?.publicKey.toString() == bet.winner.toString();
  const messages = randomScript(isWinner);
  const collectEnabled = bet.collected === 0;

  return (
    <Dialog open={true} onClose={close} className="nes-dialog is-rounded">
      <div className="winLossLogo">
        <Image
        src={messages.logo}
        width={200}
        height={200}
        layout="fixed"
        objectFit="cover"
        objectPosition="center"
        alt={isWinner ? "You won" : "You lost"}
      />
      </div>
      <section className="message-list">
        {messages.script.map((script) => (
          <Message key={script.message} script={script} />
        ))}
      </section>
      {isWinner && (
        <Collect
          enabled={collectEnabled}
          pubkey={bet.pubkey}
          close={close}
          collect={collect}
        />
      )}
      <button className="nes-btn" onClick={close}>Close</button>
    </Dialog>
  );
};
