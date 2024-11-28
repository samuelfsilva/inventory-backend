import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.stock)
  product: Product;
  
  @Column({ type: 'numeric', nullable: false })
  quantity: number;
}
