import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity.ts';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column()
  method!: string;

  @Column()
  status!: string;
}
