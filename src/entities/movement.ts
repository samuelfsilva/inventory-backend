import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MovementItem } from "./movement_item";
import { User } from "./user";

@Entity()
export class Movement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.movement)
  user: User;

  @OneToMany(() => MovementItem, (movementItem) => movementItem.movement)
  items: MovementItem[];

  @Column({ type: "datetime", nullable: false })
  movementDate: Date;

  @Column({ type: "bit", nullable: false })
  status: boolean;
}
