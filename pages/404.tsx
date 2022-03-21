import Link from "next/link";
import Image from "next/image";
import { Header } from "../components/navigation/Header";
import { FlipProvider } from "../flip-lib";

//! FIND A BETTER WAY TO LAYOUT PAGES WITH FLIPPROVIDER AND HEADER FOR EACH PAGE

export const NotFound = () => {
  return (
    <body className="main-content">
      <div className="not-found">
        {/* <FlipProvider
          partnerId="5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5"
          network={process.env.NEXT_PUBLIC_NETWORK}
        >
          <Header />
        </FlipProvider> */}
        <Image
          className="faq-icon"
          alt="Sailor-Seal"
          src="/images/Seals/seal-3-left.png"
          width={100}
          height={100}
          layout="fixed"
        />
        <h1>Oops... Arp...</h1>
        <h2>That page cannot be found.</h2>
        <p>
          Go back to the{" "}
          <Link href="/">
            <a>Homepage</a>
          </Link>
        </p>
      </div>
    </body>
  );
};

export default NotFound;
