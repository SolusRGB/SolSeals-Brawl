import { Dialog } from "react-dialog-polyfill";

export const Disclaimer = ({ isOpen, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className="nes-dialog is-rounded"
    >
      <div>
        <h2>Disclaimer</h2>
        I confirm flipping isn&apos;t forbidden in my jurisdiction and I&apos;m at least the age regulated for my jurisdiction. 
      </div>
      <button className="nes-btn is-success" onClick={() => close()}>
        I confirm
      </button>
    </Dialog>
  );
};