import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product';

@Entity()
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'datetime', nullable: false })
  expirationDate: Date;

  @ManyToOne(() => Product, (product) => product.batch)
  product: Product;
}
