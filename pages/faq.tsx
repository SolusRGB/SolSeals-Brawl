import Image from "next/image";

export const Faq = () => {
    return (
        <div className="nes-container with-title is-centered is-rounded is-faq">
            <h1>
            <Image
              className="faq-icon"
              alt="Sailor-Seal"
              src="/images/Seals/seal-right-3.png"
              width={100}
              height={100}
              layout="fixed"
            />
          </h1>
          <div className="faq">
            <h2 className="faq-title">FAQ</h2>
            <section className="trust">
                <h3>How can I trust the brawl game?</h3>
                    <p>Our brawl operates on-chain, meaning this increases security and transparency since the transactions cannot be altered once they are verified and recorded on the network.

                    Hosting PVP games removes the need for a house wallet, which is often a huge target for blockchain hackers. This means that all funds that flow through the casino are 100% safe and at no risk of being compromised.

                    </p>
            </section>
            <div className="instant-results">
            <section>
                <h3>Why are my results not always instant?</h3>
                    <p>Our brawl is PvP meaning that you are playing against another real player. Therefore, if you place a bet and no one else has placed one for the same amount as you, you will be placed into a queue until you find a match. 

                    The instant icon means that there is already a player waiting in the queue, therefore, you will be instantly matched against them and not have to wait for another player.
                    </p>
            </section>
            <section className="chances">
                <h3>What are my odds of winning/What are the fees?</h3>
                    <p>
                    Every player has a 50/50 chance of winning! A tiny fee of 3.5% is charged on each transaction to support the upkeep and development of the game. 
                    </p>
            </section>
            <section className="help-line">
                <h3>Where can I find support for a gambling addiction?</h3>
                    <p>Only ever bet with Sol you can afford to lose. If you feel that you can not stop yourself from using the casino please reach out to any member of our team and we will blacklist your wallet for you.</p>
                    <span className="help-link">Gambling Helpline: <a href="https://www.ncpgambling.org/chat/">ncpgambling.org/chat</a></span>
            </section>
            </div>
            </div>
        </div>
    );
}

export default Faq;