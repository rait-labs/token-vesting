import { FC, useCallback, useState, useEffect, useReducer } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { verify } from "@noble/ed25519";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { notify } from "../../utils/notifications";
import {
  PublicKey,
  Connection,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
  Transaction,
} from "@solana/web3.js";
import { WalletError } from "@solana/wallet-adapter-base";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  vestingProgramId,
  wlknMint,
} from "constants/common";
import { ContractInfo, toDateString, toNumberString } from "./ContractInfo";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function getContractInfo(
  connection: Connection,
  vestingAccountKey: PublicKey
): Promise<ContractInfo> {
  console.log("Fetching contract ", vestingAccountKey.toBase58());
  const vestingInfo = await connection.getAccountInfo(
    vestingAccountKey,
    "single"
  );
  if (!vestingInfo) {
    throw "Vesting contract account is unavailable";
  }
  const info = ContractInfo.fromBuffer(vestingInfo.data);
  if (!info) {
    throw "Vesting contract account is not initialized";
  }
  return info;
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

const reducer = (state, action) => {
  switch (action.type) {
    case "Increment":
      return state + 1000;
    default:
      return state;
  }
};

export const UnlockVestingView: FC = ({}) => {
  const { publicKey, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [offer, setSeed] = useState<string>(
    "111111152P2r5yt6odmBLPsFCLBrFisJ3aS7LqLEq"
  );
  const initalDate = Date.now();

  const [currentDate, dispatch] = useReducer(reducer, initalDate);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "Increment" });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const [offer, setSeed] = useState<string>("");
  const [contractInfo, setContractInfo] = useState<ContractInfo>(null);

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
      console.log(offer);
      setContractInfo(null);

      let seedWord = bs58.decode(offer);
      seedWord = seedWord.slice(0, 31);
      const [vestingAccountKey, bump] = await PublicKey.findProgramAddress(
        [seedWord],
        vestingProgramId
      );
      seedWord = Buffer.from(
        seedWord.toString("hex") + bump.toString(16),
        "hex"
      );
      const vestingTokenAccountKey = await findAssociatedTokenAddress(
        vestingAccountKey,
        wlknMint
      );
      const vestingInfo = await getContractInfo(connection, vestingAccountKey);

      setContractInfo(vestingInfo);

      console.log(vestingInfo);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Not found key! ${error?.message}`,
        description: error?.message,
      });
      console.log("error", `Not found key! ${error?.message}`);
    }
  }, [publicKey, offer, contractInfo, notify, signMessage]);

  const onClickClaim = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
      console.log("claim: ", offer);

      let seedWord = bs58.decode(offer);
      seedWord = seedWord.slice(0, 31);
      const [vestingAccountKey, bump] = await PublicKey.findProgramAddress(
        [seedWord],
        vestingProgramId
      );
      seedWord = Buffer.from(
        seedWord.toString("hex") + bump.toString(16),
        "hex"
      );
      const vestingTokenAccountKey = await findAssociatedTokenAddress(
        vestingAccountKey,
        wlknMint
      );
      const vestingInfo = await getContractInfo(connection, vestingAccountKey);

      const data = Buffer.concat([
        Buffer.from(Int8Array.from([2]).buffer),
        Buffer.concat([seedWord]),
      ]);

      const keys = [
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SYSVAR_CLOCK_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: vestingAccountKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: vestingTokenAccountKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: vestingInfo.destinationAddress,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: publicKey,
          isSigner: false,
          isWritable: false,
        },
      ];

      const transactionIns = new TransactionInstruction({
        keys,
        programId: vestingProgramId,
        data,
      });

      const transaction = new Transaction();

      const signature = await sendTransaction(
        transaction.add(transactionIns),
        connection
      );

      notify({
        type: "success",
        message: `Unlock success!`,
        txid: signature,
      });
    } catch (error: any) {
      if (error?.name != "WalletSendTransactionError")
        notify({
          type: "error",
          message: `Unlock error!`,
          description: error?.message,
        });
      console.log("error", `Unlock error! ${error?.message}`);
    }
  }, [publicKey, offer, contractInfo, notify, signMessage]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Enter your Vesting Key or Seed Id
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <input
            type="text"
            placeholder="Vesting Program Id or Seed"
            value={offer}
            onChange={(e) => setSeed(e.target.value)}
            className="input input-bordered w-full max-w-md mb-2"
          />

          <div>
            <button
              className={`group w-60 m-2 btn bg-gradient-to-r ${
                !contractInfo ? "from-[#9945FF] to-[#14F195]" : ""
              } hover:from-pink-500 hover:to-yellow-500`}
              onClick={onClick}
              disabled={!publicKey}
            >
              <div className="hidden group-disabled:block">
                Wallet not connected
              </div>
              <span className="block group-disabled:hidden">Search</span>
            </button>

            <button
              className={`group w-60 m-2 btn bg-gradient-to-r ${
                !contractInfo ? "" : "from-[#9945FF] to-[#14F195]"
              } hover:from-pink-500 hover:to-yellow-500`}
              onClick={onClickClaim}
              disabled={!contractInfo}
            >
              <div className="hidden group-disabled:block">
                Find contract info first
              </div>
              <span className="block group-disabled:hidden">Unlock</span>
            </button>
          </div>

          {contractInfo && (
            <div className="">
              <p className="mt-4 text-left">
                Wallet address:
                <span className="badge badge-accent px-2 py-2 ml-2 badge-lg">
                  {publicKey?.toString()}
                </span>
              </p>
              <p className="mt-4 text-left">
                Destination address:
                <span className="badge badge-accent px-2 py-2 ml-2 badge-lg">
                  {contractInfo?.destinationAddress?.toString()}
                </span>
              </p>
              <p className="mt-4 text-left">
                Mint address:
                <span className="badge badge-accent px-2 py-2 ml-2 badge-lg">
                  {contractInfo?.mintAddress?.toString()}
                </span>
              </p>

              <p className="mt-4 mb-4 text-left">
                Schedules: {toDateString(currentDate)}
              </p>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Release time</th>
                      <th>amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractInfo?.schedules.map((s, index) => {
                      return (
                        <tr>
                          <td>
                            {toDateString(s.releaseTime.toNumber() * 1000)}
                          </td>
                          <td>{toNumberString(s.amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
