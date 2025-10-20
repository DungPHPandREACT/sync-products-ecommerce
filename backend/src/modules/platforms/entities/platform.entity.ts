import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductMapping } from '../../products/entities/product-mapping.entity';
import { Order } from '../../orders/entities/order.entity';
import { SyncLog } from '../../sync/entities/sync-log.entity';
import { WebhookEvent } from '../../webhooks/entities/webhook-event.entity';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  display_name: string;

  @Column({ type: 'json', nullable: true })
  api_config: Record<string, any>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  webhook_url: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => ProductMapping, mapping => mapping.platform)
  product_mappings: ProductMapping[];

  @OneToMany(() => Order, order => order.platform)
  orders: Order[];

  @OneToMany(() => SyncLog, log => log.platform)
  sync_logs: SyncLog[];

  @OneToMany(() => WebhookEvent, event => event.platform)
  webhook_events: WebhookEvent[];
}
