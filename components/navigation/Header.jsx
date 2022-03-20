import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Balance } from "./Balance";
import { Loading } from "./Loading";
import Image from "next/image";
import Link from "next/link"

export const Header = () => {
  return (
    <header className="sticky">
      <div className="container">
        <div className="nav-brand">
          <h1>
            <Image
              className="brand-logo"
              alt="SolSeals Casino"
              src="/casino_logo.png"
              width={200}
              height={50}
              layout="fixed"
              priority lazy
            />
          </h1>
          {process.env.NEXT_PUBLIC_NETWORK !== "mainnet" && (
            <a href="#" className="nes-badge">
              <span className="is-primary">
                {process.env.NEXT_PUBLIC_NETWORK}
              </span>
            </a>
          )}
        </div>
        <div className="wallet-boxes">
          <div className="loading-item">
            <Loading />
          </div>
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
