import Image from "next/image";
import { Header } from "../components/navigation/Header";
import { FlipProvider } from "../flip-lib";

//! FIND A BETTER WAY TO LAYOUT PAGES WITH FLIPPROVIDER AND HEADER FOR EACH PAGE

export const bugreport = () => {
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
          className="bugreport-icon"
          alt="Bubble Seal"
          src="/images/Seals/seal-4-left.png"
          width={100}
          height={100}
          layout="fixed"
        />
      </h1>
      <h2 className="bugreport-title">
        I&apos;ve found a bug, how do I report it?
      </h2>
      <p>
        If you have found a bug in the casino, please fill in the following
        form:
      </p>
      <a
        className="nes-btn is-success"
        href="https://forms.gle/UsRCQ5whmUWSWxSH9"
      >
        Form
      </a>
    </div>
  );
};

export default bugreport;
