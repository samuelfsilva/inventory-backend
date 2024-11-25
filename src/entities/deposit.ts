import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;
}
