import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductMapping } from '../../products/entities/product-mapping.entity';

@Entity('sync_conflicts')
export class SyncConflict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  product_mapping_id: number;

  @Column({ type: 'varchar', length: 50 })
  conflict_type: string;

  @Column({ type: 'json' })
  local_value: Record<string, any>;

  @Column({ type: 'json' })
  platform_value: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  resolution: string;

  @Column({ type: 'int', nullable: true })
  resolved_by: number;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => ProductMapping, mapping => mapping.id)
  @JoinColumn({ name: 'product_mapping_id' })
  product_mapping: ProductMapping;
}
