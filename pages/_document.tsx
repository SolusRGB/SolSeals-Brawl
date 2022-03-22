import { Html, Head, Main, NextScript } from "next/document";
import { Footer } from "../components/Footer";
import { Header } from "../components/navigation/Header";
import { FlipProvider } from "@rngstudio/flip";

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
      <FlipProvider
          partnerId="5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5"
          network={process.env.NEXT_PUBLIC_NETWORK}
        >
          <Header />
        </FlipProvider>
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  );
}
