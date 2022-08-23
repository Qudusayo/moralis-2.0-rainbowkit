import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  createClient,
  configureChains,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { provider, webSocketProvider, chains } = configureChains(defaultChains, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "MoralisV2 Rainbow kit",
  chains,
});

const client = createClient({
  provider,
  connectors,
  webSocketProvider,
  autoConnect: true,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
