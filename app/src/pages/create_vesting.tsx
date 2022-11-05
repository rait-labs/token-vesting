import type { NextPage } from "next";
import Head from "next/head";
import { CreateVestingView } from "../views";

const CreateVesting: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Create vesting"
        />
      </Head>
      <CreateVestingView />
    </div>
  );
};

export default CreateVesting;
