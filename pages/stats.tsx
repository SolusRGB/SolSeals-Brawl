import { NextPage } from "next";
import Head from "next/head";
import { Header } from "../components/navigation/Header";
import { Stats } from "../components/stats/Stats";
import { FlipProvider } from "@rngstudio/flip";

const Index: NextPage = () => {
  return (
    <div id="bananos">
      <Head>
        <title>PvP Brawl By SolSeals</title>
        <meta
          name="description"
          content="Test Your Luck with the player vs player coin-flip game. Send your seal to battle to find out who is the ultimate seal fighter!"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <FlipProvider partnerId="5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5" network={process.env.NEXT_PUBLIC_NETWORK}>
        <Header />
      </FlipProvider>

      <div className="container">
        <main className="main-content">
          <Stats />
        </main>
      </div>
    </div>
  );
};

export default Index;
