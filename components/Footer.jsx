import Link from "next/link";

export const Footer = () => {
  return (
    <footer>
      <nav>
        <div className="footer-nav">
          <Link href="/how-to-play">
            <a className="nes-btn false footer">How To Play</a>
          </Link>
          <Link href="/faq">
            <a className="nes-btn false footer">FAQ</a>
          </Link>
          <Link href="/">
            <a className="nes-btn false footer">Home</a>
          </Link>
          <Link href="/bugreport">
            <a className="nes-btn false footer">Bug Report</a>
          </Link>
        </div>
      </nav>
      <div className="social-icons">
        <div className="share">
          <a
            href="http://twitter.com/RealSolSeals"
            rel="noreferrer"
            target="_blank"
          >
            <i className="nes-icon twitter" />
          </a>
          <i className="nes-icon coin"></i>
          <a
            href="https://discord.gg/A5sqZSydJ3"
            rel="noreferrer"
            target="_blank"
          >
            <i className="nes-icon discord" />
          </a>
        </div>
      </div>
    </footer>
  );
};
