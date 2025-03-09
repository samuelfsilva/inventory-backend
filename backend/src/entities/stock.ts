import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Batch } from "./batch";
import { Deposit } from "./deposit";

@Entity()
export class Stock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Batch, (batch) => batch.stock)
  @JoinColumn({ name: "batchId" })
  batch: Batch;

  @ManyToOne(() => Deposit, (deposit) => deposit.stock)
  @JoinColumn({ name: "depositId" })
  deposit: Deposit;

  @Column({ type: "numeric", nullable: false })
  quantity: number;
}
