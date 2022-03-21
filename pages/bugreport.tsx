import Image from "next/image";

//! FIND A BETTER WAY TO LAYOUT PAGES WITH FLIPPROVIDER AND HEADER FOR EACH PAGE

export const bugreport = () => {
  return (
    <body className="main-content">
      <div className="nes-container with-title is-centered is-rounded is-faq">
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
    </body>
  );
};

export default bugreport;
