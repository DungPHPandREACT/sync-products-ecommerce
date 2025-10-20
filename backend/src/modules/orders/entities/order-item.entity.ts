import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductMapping } from '../../products/entities/product-mapping.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  order_id: number;

  @Column({ type: 'int', nullable: true })
  product_id: number;

  @Column({ type: 'int', nullable: true })
  product_mapping_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Order, order => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductMapping, mapping => mapping.id)
  @JoinColumn({ name: 'product_mapping_id' })
  product_mapping: ProductMapping;
}
