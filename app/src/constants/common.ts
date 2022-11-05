import { PublicKey } from "@solana/web3.js";
import { Numberu64 } from "./Number64";

export const vestingProgramId = new PublicKey(
  "6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm"
);

export const wlknMint = new PublicKey(
  "2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une"
);

export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export function toNumberString(_: Numberu64): string {
  return (_.toNumber() / 1000000000)?.toString();
}

export function toDateString(_: number): string {
  const dateFormat = new Date(_);
  const dateFormatValue =
    (dateFormat.getDate() < 10 ? "0" : "") +
    dateFormat.getDate() +
    "/" +
    (dateFormat.getMonth() + 1 < 10 ? "0" : "") +
    (dateFormat.getMonth() + 1) +
    "/" +
    dateFormat.getFullYear() +
    " " +
    (dateFormat.getHours() < 10 ? "0" : "") +
    dateFormat.getHours() +
    ":" +
    (dateFormat.getMinutes() < 10 ? "0" : "") +
    dateFormat.getMinutes() +
    ":" +
    (dateFormat.getSeconds() < 10 ? "0" : "") +
    dateFormat.getSeconds();
  return dateFormatValue;
}
