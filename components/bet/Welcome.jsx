import Image from 'next/image';

export const Welcome = () => {
    return <section className="nes-container is-rounded">
        <section className="message-list">
            <section className="message -left">
                <Image src="/images/Seals/seal-right-3.png" alt="Philly" width={100} height={100} layout="fixed"/>
                <div className="nes-balloon from-left">
                    Arp! You stepped on my tail....
                </div>
            </section>
            <section className="message -right">
                <div className="nes-balloon from-right">
                   Connect your wallet above to test your luck against other seals like yourself. Careful not to step on anyone elses tail next time.
                </div>
                <Image src="/images/Seals/seal-left-3.png" alt="Sonny" width={100} height={100} layout="fixed" />
            </section>
        </section>
    </section>
}