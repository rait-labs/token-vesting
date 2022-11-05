import { PublicKey } from "@solana/web3.js";

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
