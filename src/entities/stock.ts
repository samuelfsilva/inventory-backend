import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Deposit } from "./deposit";
import { Product } from "./product";

@Entity()
export class Stock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Product, (product) => product.stock)
  product: Product;

  @ManyToOne(() => Deposit, (deposit) => deposit.stock)
  @JoinColumn({ name: "depositId" })
  deposit: Deposit;

  @Column({ type: "numeric", nullable: false })
  quantity: number;
}
