import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (product) => product.group)
  product: Product[];

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
