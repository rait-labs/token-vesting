import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import moment from "moment";
import { FC, useCallback, useState } from "react";

import { PublicKey, Transaction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  vestingProgramId,
  wlknMint,
} from "constants/common";
import { notify } from "../../utils/notifications";

import { Numberu64 } from "constants/Number64";
import { Schedule } from "constants/Shedule";
import { create, getSeedWord } from "constants/vesting";
import "react-datepicker/dist/react-datepicker.css";

export const CreateVestingView: FC = ({}) => {
  const { publicKey, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [destinationAddress, setDestinationAddress] = useState<string>(
    "3DA2DduS7GJSoAwzsdFYJvAAaZ6NbURRzoLexsQdM5sS"
  );
  const [totalAmount, setTotalAmount] = useState<string>("100");
  const [initialPercent, setInitialPercent] = useState<string>("10");
  const [startDate, setStartDate] = useState(moment.utc().toDate());
  const [cliff, setCliff] = useState(moment.utc().format("YYYY-MM-DD"));
  const [numberOfMonths, setNumberOfMonths] = useState<string>("6");
  const [contractId, setContractId] = useState<string>("");

  const onClickCreateContract = useCallback(async () => {
    const SEED = Buffer.from(destinationAddress.toString());

    let seedWord = await getSeedWord(SEED);

    seedWord = seedWord.slice(0, 31);

    const [, bump] = await PublicKey.findProgramAddress(
      [seedWord],
      vestingProgramId
    );

    seedWord = Buffer.from(seedWord.toString("hex") + bump.toString(16), "hex");

    setContractId(bs58.encode(seedWord));
  }, [destinationAddress]);

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
      console.log("Destination address: ", destinationAddress);
      const offer = destinationAddress;
      const monthNumber = numberOfMonths;
      // const cliff = startDate;

      let destPublicKey = new PublicKey(offer);

      const unix = moment.utc(cliff).unix();

      const wlknSupply = await connection.getTokenSupply(wlknMint);

      const decimals = wlknSupply.value.decimals;

      const VESTING_START = new Numberu64(unix);
      const MONTHLY_SLOTS = new Numberu64(30 * 24 * 60 * 60);

      const AMOUNT = new Numberu64(
        new Numberu64(totalAmount.toString())
          .mul(new Numberu64((10 ** decimals).toString()))
          .toString()
      );

      const SEED = Buffer.from(offer.toString());

      const sourceTokenAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        wlknMint,
        publicKey
      );

      const getSchedule = () => {
        const shedules: Schedule[] = [];
        const initial = new Numberu64(
          AMOUNT.divn(parseInt(initialPercent)).toString()
        ); // % on start
        shedules.push(new Schedule(VESTING_START, initial));
        const quaterlyPart = new Numberu64(
          AMOUNT.sub(initial).divn(parseInt(monthNumber)).toString()
        ); //
        for (let index = 0; index < parseInt(monthNumber); index++) {
          shedules.push(
            new Schedule(
              new Numberu64(
                VESTING_START.add(MONTHLY_SLOTS.muln(index + 1)).toString()
              ),
              quaterlyPart
            )
          );
        }
        return shedules;
      };

      const associatedAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        wlknMint,
        destPublicKey
      );

      const seedWord = await getSeedWord(SEED);

      const shedule = getSchedule();

      const ixs = await create(
        connection,
        vestingProgramId,
        seedWord,
        publicKey,
        publicKey,
        sourceTokenAddress,
        associatedAddress, // Destination
        wlknMint,
        shedule
      );

      const tx = new Transaction().add(...ixs);
      tx.feePayer = publicKey;
      // tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      console.log("sendTransaction: ", tx);
      const signature = await sendTransaction(tx, connection);
      console.log("signature: ", signature);

      const latestBlockHash = await connection.getLatestBlockhash();
      const response = await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        },
        "processed"
      );

      console.log("confirmTransaction Success: ", response);

      notify({
        type: "success",
        message: `Unlock success!`,
        txid: signature,
      });
    } catch (error: any) {
      if (error?.name != "WalletSendTransactionError")
        notify({
          type: "error",
          message: `Create error!`,
          description: error?.message,
        });
      console.log("Create error: ", error);
    }
  }, [
    publicKey,
    destinationAddress,
    totalAmount,
    initialPercent,
    startDate,
    numberOfMonths,
    contractId,
    notify,
    signMessage,
  ]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Setup new vesting
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center w-full mt-4">
          <input
            type="text"
            placeholder="Destination Address"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            className="block input input-bordered w-full mb-4"
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="block input input-bordered w-full mb-4"
          />
          <input
            type="number"
            placeholder="Initial Percent"
            value={initialPercent}
            max={100}
            min={0}
            onChange={(e) => {
              if (+e.target.value > 100) return;
              setInitialPercent(e.target.value);
            }}
            className="block input input-bordered w-full mb-4"
          />

          <input
            type="date"
            placeholder="Cliff"
            value={cliff}
            onChange={(e) => {
              setCliff(e.target.value);
            }}
            className="block input input-bordered w-full mb-4"
          />

          {/* <DatePicker
            className="block input input-bordered w-full mb-4 text-white"
            placeholder="Cliff"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm aa"
          /> */}

          <input
            type="number"
            placeholder="Number of months"
            value={numberOfMonths}
            max={100}
            min={0}
            onChange={(e) => {
              if (+e.target.value > 999) return;
              setNumberOfMonths(e.target.value);
            }}
            className="block input input-bordered w-full mb-4"
          />

          <div>
            <button
              className={`group w-full mb-4 btn  hover:from-pink-500 hover:to-yellow-500`}
              onClick={onClickCreateContract}
              disabled={!publicKey}
            >
              <div className="hidden group-disabled:block">
                Wallet not connected
              </div>
              <span className="block group-disabled:hidden">Init contract</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Destination Address"
            value={contractId}
            disabled={true}
            className="block input input-bordered w-full mb-4"
          />

          <button
            className={`group w-full btn bg-gradient-to-r 
         ${!contractId ? "" : "from-[#9945FF] to-[#14F195]  "}   
             hover:from-pink-500 hover:to-yellow-500`}
            onClick={onClick}
            disabled={!publicKey}
          >
            <div className="hidden group-disabled:block">
              {!contractId ? "Init contract first" : "Wallet not connected"}
            </div>
            <span className="block group-disabled:hidden">Create</span>
          </button>

          <button
            className={`group w-full btn bg-gradient-to-r 
         ${!contractId ? "" : "from-[#9945FF] to-[#14F195]  "}   
             hover:from-pink-500 hover:to-yellow-500`}
            onClick={async () => {
              const txInfo = await connection.getConfirmedTransaction(
                "3oyLhyC6UEckscfFcVuHR4ysdu3Y4cE6L1z6WvDrLZ1WL2Rd1y1dGTfk1EArFtMz5asXnrMmhANnBCkX7qQuq5Uv",
                "confirmed"
              );
              if (txInfo && !txInfo.meta?.err) {
                console.log(
                  "seed: ",
                  txInfo?.transaction.instructions[2].data
                    .slice(1, 32 + 1)
                    .toString("hex")
                );
              } else {
                throw new Error("Transaction not confirmed.");
              }
            }}
            disabled={!publicKey}
          >
            <div className="hidden group-disabled:block">
              {!contractId ? "Init contract first" : "Wallet not connected"}
            </div>
            <span className="block group-disabled:hidden">Seed from tx</span>
          </button>
        </div>
      </div>
    </div>
  );
};
