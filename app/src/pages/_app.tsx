import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Scaffold Lite</title>
      </Head>

      <ThemeProvider
        attribute="class"
        enableColorScheme={false}
        defaultTheme="dark"
      >
        <ContextProvider>
          <div className="flex flex-col h-screen">
            <Notifications />
            <AppBar />
            <ContentContainer>
              <Component {...pageProps} />
            </ContentContainer>
            <Footer />
          </div>
        </ContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
