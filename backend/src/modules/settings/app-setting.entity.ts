import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('app_settings')
export class AppSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 30 })
  sync_interval_minutes: number;

  @Column({ type: 'int', default: 100 })
  batch_size: number;

  @Column({ type: 'int', default: 3 })
  max_retries: number;

  @Column({ type: 'varchar', length: 20, default: 'manual' })
  default_conflict_resolution: 'local' | 'platform' | 'manual';

  @Column({ type: 'boolean', default: false })
  auto_resolve_conflicts: boolean;

  @Column({ type: 'boolean', default: false })
  notify_on_conflicts: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  webhook_base_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  webhook_secret: string | null;

  @Column({ type: 'boolean', default: false })
  enable_webhooks: boolean;

  @UpdateDateColumn()
  updated_at: Date;
}


