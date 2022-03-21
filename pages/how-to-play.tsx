import Image from "next/image";
import { Header } from "../components/navigation/Header";
import { FlipProvider } from "../flip-lib";

//! FIND A BETTER WAY TO LAYOUT PAGES WITH FLIPPROVIDER AND HEADER FOR EACH PAGE

export const howtoplay = () => {
  return (
    <div className="nes-container with-title is-centered is-rounded is-faq">
      <FlipProvider
        partnerId="5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5"
        network={process.env.NEXT_PUBLIC_NETWORK}
      >
        <Header />
      </FlipProvider>
      <h1>
        <Image
          className="how-to-icon"
          alt="Smokey Seal"
          src="/images/Seals/seal-1.png"
          width={100}
          height={100}
          layout="fixed"
        />
      </h1>
      <h2 className="how-to-title">How To Play</h2>
      <section className="how-to-section">
        <p>1. Connect your wallet to the site.</p>

        <p>
          2. Choose the amount you would like to bet from the following options:
          0.1, 0.25, 0.5 and 1 Solana{" "}
          <span className="coming-soon">($TUNA coming soon!)</span>
        </p>

        <p>3. When you are ready to play press the Place Bet button.</p>

        <p>4. Approve the transaction.</p>

        <p>
          5. Once you have initiated the bet you will be placed into the betting
          queue against all other players who have chosen the same bet total. If
          there is someone already waiting in the betting queue you will
          instantly be matched against them.
        </p>

        <p>
          6. If you have won the brawl select the{" "}
          <span className="coming-soon">collect</span> button and approve the
          transaction to claim your winnings.
        </p>
      </section>
    </div>
  );
};

export default howtoplay;
