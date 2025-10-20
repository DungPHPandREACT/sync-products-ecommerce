import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Platform } from '../../platforms/entities/platform.entity';

@Entity('product_mappings')
export class ProductMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  platform_id: number;

  @Column({ nullable: true })
  platform_product_id: string;

  @Column({ type: 'json', nullable: true })
  platform_data: any;

  @Column({ default: 'pending' })
  sync_status: string;

  @Column({ nullable: true })
  last_synced_at: Date;

  @Column({ default: 'bidirectional' })
  sync_direction: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, product => product.product_mappings)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Platform)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;
}