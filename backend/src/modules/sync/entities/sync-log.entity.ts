import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Platform } from '../../platforms/entities/platform.entity';

@Entity('sync_logs')
export class SyncLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  platform_id: number;

  @Column({ type: 'varchar', length: 50 })
  sync_type: string;

  @Column({ type: 'varchar', length: 10 })
  sync_direction: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({ type: 'int', default: 0 })
  records_processed: number;

  @Column({ type: 'int', default: 0 })
  records_success: number;

  @Column({ type: 'int', default: 0 })
  records_failed: number;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'json', nullable: true })
  sync_data: Record<string, any>;

  // Relations
  @ManyToOne(() => Platform, platform => platform.sync_logs)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;
}
