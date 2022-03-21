import Link from "next/link";
import Image from "next/image";

//! FIND A BETTER WAY TO LAYOUT PAGES WITH FLIPPROVIDER AND HEADER FOR EACH PAGE

export const NotFound = () => {
  return (
    <body className="main-content">
      <div className="nes-container with-title is-centered is-rounded">
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
        <p id="lost-button">
          Go back to the{" "}
          <Link href="/">
            <a className="nes-btn is-success">Homepage</a>
          </Link>
        </p>
      </div>
    </body>
  );
};

export default NotFound;
