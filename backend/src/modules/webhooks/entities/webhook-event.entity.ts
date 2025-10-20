import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Platform } from '../../platforms/entities/platform.entity';

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  platform_id: number;

  @Column({ type: 'varchar', length: 100 })
  event_type: string;

  @Column({ type: 'json' })
  payload: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Platform, platform => platform.webhook_events)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;
}
