import { NextPage } from "next";
import Head from "next/head";
import { Header } from "../components/navigation/Header";
import { Stats } from "../components/stats/Stats";
import { FlipProvider } from "../flip-lib";

const Index: NextPage = () => {
  return (
    <div id="bananos">
      <Head>
        <title>ROAD RUGGER BY BANANOS MC</title>
        <meta name="description" content="Race if you dare" />
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
      <FlipProvider partnerId="">
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