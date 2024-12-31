import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product";
import { Stock } from "./stock";

@Entity()
export class Batch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "datetime", nullable: false })
  expirationDate: Date;

  @ManyToOne(() => Product, (product) => product.batch)
  product: Product;

  @OneToMany(() => Stock, (stock) => stock.batch)
  stock: Stock[];
}
