import { Numberu64 } from "./Number64";

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
