import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import assert from "assert";

export function toNumberString(_: Numberu64): string {
  return (_.toNumber() / 1000000000)?.toString();
}

export function toDateString(_: number): string {
  const dateFormat = new Date(_);
  const dateFormatValue =
    (dateFormat.getDate() < 10 ? "0" : "") +
    dateFormat.getDate() +
    "/" +
    (dateFormat.getMonth() < 10 ? "0" : "") +
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

export class ContractInfo {
  destinationAddress: PublicKey;
  mintAddress: PublicKey;
  schedules: Array<Schedule>;

  constructor(
    destinationAddress: PublicKey,
    mintAddress: PublicKey,
    schedules: Array<Schedule>
  ) {
    this.destinationAddress = destinationAddress;
    this.mintAddress = mintAddress;
    this.schedules = schedules;
  }

  static fromBuffer(buf: Buffer): ContractInfo | undefined {
    const header = VestingScheduleHeader.fromBuffer(buf.slice(0, 65));
    if (!header.isInitialized) {
      return undefined;
    }
    const schedules: Array<Schedule> = [];
    for (let i = 65; i < buf.length; i += 16) {
      schedules.push(Schedule.fromBuffer(buf.slice(i, i + 16)));
    }
    return new ContractInfo(
      header.destinationAddress,
      header.mintAddress,
      schedules
    );
  }
}

export class Schedule {
  // Release time in unix timestamp
  releaseTime: Numberu64;
  amount: Numberu64;

  constructor(releaseTime: Numberu64, amount: Numberu64) {
    this.releaseTime = releaseTime;
    this.amount = amount;
  }

  toBuffer(): Buffer {
    return Buffer.concat([this.releaseTime.toBuffer(), this.amount.toBuffer()]);
  }

  static fromBuffer(buf: Buffer): Schedule {
    const releaseTime: Numberu64 = Numberu64.fromBuffer(buf.slice(0, 8));
    const amount: Numberu64 = Numberu64.fromBuffer(buf.slice(8, 16));
    return new Schedule(releaseTime, amount);
  }
}

export class Numberu64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = new Buffer(a);
    if (b.length === 8) {
      return b;
    }
    assert(b.length < 8, "Numberu64 too large");

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer) {
    assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    // @ts-ignore
    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }

  /**
   * Convert to Buffer representation
   */
}

export class VestingScheduleHeader {
  destinationAddress: PublicKey;
  mintAddress: PublicKey;
  isInitialized: boolean;

  constructor(
    destinationAddress: PublicKey,
    mintAddress: PublicKey,
    isInitialized: boolean
  ) {
    this.destinationAddress = destinationAddress;
    this.mintAddress = mintAddress;
    this.isInitialized = isInitialized;
  }

  static fromBuffer(buf: Buffer): VestingScheduleHeader {
    const destinationAddress = new PublicKey(buf.slice(0, 32));
    const mintAddress = new PublicKey(buf.slice(32, 64));
    const isInitialized = buf[64] == 1;
    const header: VestingScheduleHeader = {
      destinationAddress,
      mintAddress,
      isInitialized,
    };
    return header;
  }
}
