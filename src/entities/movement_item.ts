import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movement } from './movement';
import { Product } from './product';

@Entity()
export class MovementItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movement, (movement) => movement.items)
  @JoinColumn({ name: 'movement_id' })
  movement: Movement;

  @ManyToOne(() => Product, (product) => product.movementItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', nullable: true })
  details: string | null;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Column({ type: 'numeric', nullable: true })
  quantity: number | null;
}
