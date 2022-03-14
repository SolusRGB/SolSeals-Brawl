import { Dialog } from "react-dialog-polyfill";
import { errors } from '../../scripts';
import Image from 'next/image';

import { useError, closeError } from "../../flip-lib";

const Message = ({ script }) => {
  const { side, message, icon } = script;

  return (
    <section className={`message -${side}`}>
      {side === "left" && <Image src={icon} alt="Biker" width={100} height={100} layout="fixed" />}
      <div className={`nes-balloon from-${side}`}>
        <p>{message}</p>
      </div>
      {side === "right" && <Image src={icon} alt="Biker" width={100} height={100} layout="fixed" />}
    </section>
  );
};

export const Error = () => {
  const type = useError();
  const isOpen = !!type;

  if (!type) {
    return <></>
  }
  console.log('type is', type);
  const error = errors[type];
  return (
    <Dialog
      open={isOpen}
      onClose={closeError}
      className="nes-dialog is-rounded"
    >
      <section className="message-list">
        {error.script.map((script) => (
          <Message key={script.message} script={script} />
        ))}
      </section>
      <button className="nes-btn is-error" onClick={closeError}>
        {error.closeMessage}
      </button>
    </Dialog>
  );
};