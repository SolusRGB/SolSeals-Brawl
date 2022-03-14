import Image from 'next/image';

export const Welcome = () => {
    return <section className="nes-container is-rounded is-dark">
        <section className="message-list">
            <section className="message -left">
                <Image src="/images/philly.png" alt="Philly" width={100} height={100} layout="fixed"/>
                <div className="nes-balloon from-left is-dark">
                    Oh look, we have another member who wants to play road rugger with the gang.
                </div>
            </section>
            <section className="message -right">
                <div className="nes-balloon from-right is-dark">
                   Connect your wallet above to race against BANANOS MC gang members and other newbies like yourself
                </div>
                <Image src="/images/sonny.png" alt="Sonny" width={100} height={100} layout="fixed" />
            </section>
        </section>
    </section>
}