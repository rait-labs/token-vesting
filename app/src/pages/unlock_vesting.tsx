import type { NextPage } from "next";
import Head from "next/head";
import { UnlockVestingView } from "../views";

const UnlockVesting: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Unlock vesting"
        />
      </Head>
      <UnlockVestingView />
    </div>
  );
};

export default UnlockVesting;
