import { NextPage } from "next";
import Head from "next/head";
import { Header } from "../components/navigation/Header";
import { Main } from "../components/bet/Main";
import { FlipProvider } from "@rngstudio/flip";

const Index: NextPage = () => {
  return (
    <div id="bananos">
      <Head>
        <title>PvP Casino By SolSeals</title>
        <meta name="description" content="Test Your Luck" />
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
      {/*Add partner Id wallet here */}
      <FlipProvider
        partnerId="5fVWRf1AAhMkrr8mYbej8NjYQkzcz7uTmkoNiW9Wp5M5"
        network={process.env.NEXT_PUBLIC_NETWORK}
      >
        <Header />

        <div className="container">
          <main className="main-content">
            <Main />
          </main>
        </div>
      </FlipProvider>
    </div>
  );
};

export default Index;
