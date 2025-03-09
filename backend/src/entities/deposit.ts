import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock";

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "bit", nullable: false })
  status: boolean;

  @OneToMany(() => Stock, (stock) => stock.deposit)
  stock: Stock[];
}
