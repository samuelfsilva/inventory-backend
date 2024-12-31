import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Batch } from "./batch";
import { Category } from "./category";
import { Group } from "./group";
import { MovementItem } from "./movement_item";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => Group, (group) => group.product)
  @JoinColumn({ name: "groupId" })
  group: Group;

  @OneToMany(() => Batch, (batch) => batch.product)
  batch: Batch[];

  @OneToMany(() => MovementItem, (movementItem) => movementItem.product)
  movementItems: MovementItem[];

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "boolean", nullable: false })
  isActive: boolean;
}
