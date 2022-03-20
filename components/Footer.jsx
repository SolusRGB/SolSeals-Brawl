import Link from 'next/link'

export const Footer = () => {
  return (
    <footer>
      <nav>
        <div className="footer-nav">
          <Link href="/how-to-play"><a>How To Play <span>|</span></a></Link>
          <Link href="/faq"><a>FAQ <span>|</span></a></Link>
          <Link href="/"><a>Home <span>|</span></a></Link>
          <Link href="/bugreport"><a>Bug Report</a></Link>
        </div>
      </nav>
      <div className="social-icons">
          <div className="share">
              <a href="http://twitter.com/RealSolSeals" rel="noreferrer" target="_blank">
                <i className="nes-icon twitter"/>
              </a>
              <i className="nes-icon coin"></i>
              <a href="https://discord.gg/A5sqZSydJ3" rel="noreferrer" target="_blank">
                <i className="nes-icon discord"/>
              </a>
          </div>
        </div>

    </footer>
  );
};
