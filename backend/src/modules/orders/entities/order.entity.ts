import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Platform } from '../../platforms/entities/platform.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  platform_id: number;

  @Column({ type: 'varchar', length: 100 })
  platform_order_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customer_phone: string;

  @Column({ type: 'json', nullable: true })
  shipping_address: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  billing_address: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Platform, platform => platform.orders)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  order_items: OrderItem[];
}
