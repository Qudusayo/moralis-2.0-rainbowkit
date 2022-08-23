import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

function SignIn() {
  const { isConnected, address, status: accStatus } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const userData = { address, chain: chain.id, network: "evm" };

      const { data } = await axios.post("/api/auth/request-message", userData, {
        headers: {
          "content-type": "application/json",
        },
      });

      const message = data.message;
      console.log(message);

      const signature = await signMessageAsync({ message });
      console.log(signature);

      // redirect user after success authentication to '/user' page
      const res = await signIn("credentials", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/user",
      });
      console.log(res);
      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      push(res.url);
    };
    if (
      status === "unauthenticated" &&
      isConnected &&
      accStatus === "connected"
    ) {
      handleAuth();
    }
    console.log(accStatus);
  }, [status, isConnected, accStatus]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3>Web3 Authentication</h3>
        <ConnectButton />
      </main>
    </div>
  );
}

export default SignIn;
