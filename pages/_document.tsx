import { Html, Head, Main, NextScript } from "next/document";
import { Footer } from '../components/Footer';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Press+Start+2P"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  );
}