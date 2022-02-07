import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Balance } from "./Balance";
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="sticky">
      <div className="container">
        <div className="nav-brand">
          <a href="#">
            <h1>
              <Image
                className="brand-logo"
                alt="Road Rugger"
                src="/images/logo.png"
                width={300}
                height={50}
                layout="fixed"
              />
            </h1>
          </a>
        </div>
        <div>
          <div className="nav-item">
            <Balance />
          </div>
          <div className="nav-item">
            <WalletMultiButton className="nes-btn is-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};

//<WalletMultiButton />
