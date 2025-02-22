import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movement } from "./movement";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Movement, (movement) => movement.user)
  movement: Movement;

  @Column({ type: "varchar", nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  firstName: string;

  @Column({ type: "varchar", nullable: false })
  lastName: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "bit", nullable: false })
  status: boolean;
}
