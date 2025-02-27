import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "bit", nullable: false })
  status: boolean;
}
