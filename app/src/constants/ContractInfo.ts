import { PublicKey } from "@solana/web3.js";
import { Schedule } from "./Shedule";
import { VestingScheduleHeader } from "./VestingSheduleHeadet";

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
