import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { MovementItem } from './movement_item';

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sales)
  user: User;

  @OneToMany(() => MovementItem, (movementItem) => movementItem.movement)
  items: MovementItem[];

  @Column({ type: 'datetime', nullable: false })
  movementDate: Date;

  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;
}
