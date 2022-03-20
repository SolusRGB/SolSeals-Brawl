import Link from "next/link";
import Image from "next/image";

export const NotFound = () => {
    return(

    <div className="not-found">
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
        <p>Go back to the <Link href="/"><a>Homepage</a></Link></p>
    </div>)
}

export default NotFound;