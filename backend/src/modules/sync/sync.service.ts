import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog } from './entities/sync-log.entity';
import { SyncConflict } from './entities/sync-conflict.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncLog)
    private syncLogRepository: Repository<SyncLog>,
    @InjectRepository(SyncConflict)
    private syncConflictRepository: Repository<SyncConflict>,
  ) {}

  async findAllLogs(): Promise<SyncLog[]> {
    return this.syncLogRepository.find({
      relations: ['platform'],
      order: { started_at: 'DESC' },
    });
  }

  async findAllConflicts(): Promise<SyncConflict[]> {
    return this.syncConflictRepository.find({
      relations: ['product_mapping'],
      order: { created_at: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const totalJobs = await this.syncLogRepository.count();
    const successfulJobs = await this.syncLogRepository.count({ where: { status: 'completed' } });
    const failedJobs = await this.syncLogRepository.count({ where: { status: 'failed' } });
    const pendingJobs = await this.syncLogRepository.count({ where: { status: 'pending' } });
    
    const totalConflicts = await this.syncConflictRepository.count();
    const resolvedConflicts = await this.syncConflictRepository.count({ where: { resolution: 'resolved' } });
    const pendingConflicts = await this.syncConflictRepository.count({ where: { resolution: 'pending' } });

    return {
      total_jobs: totalJobs,
      successful_jobs: successfulJobs,
      failed_jobs: failedJobs,
      pending_jobs: pendingJobs,
      total_conflicts: totalConflicts,
      resolved_conflicts: resolvedConflicts,
      pending_conflicts: pendingConflicts,
    };
  }

  async createLog(logData: Partial<SyncLog>): Promise<SyncLog> {
    const log = this.syncLogRepository.create(logData);
    return this.syncLogRepository.save(log);
  }

  async createConflict(conflictData: Partial<SyncConflict>): Promise<SyncConflict> {
    const conflict = this.syncConflictRepository.create(conflictData);
    return this.syncConflictRepository.save(conflict);
  }

  async resolveConflict(id: number, resolution: string, resolvedBy: number): Promise<SyncConflict> {
    await this.syncConflictRepository.update(id, {
      resolution,
      resolved_by: resolvedBy,
      resolved_at: new Date(),
    });
    return this.syncConflictRepository.findOne({ where: { id } });
  }

  async startSync(syncType: string, direction: string, platformId?: number): Promise<any> {
    // TODO: Implement actual sync logic
    const log = await this.createLog({
      platform_id: platformId,
      sync_type: syncType,
      sync_direction: direction,
      status: 'started',
      started_at: new Date(),
    });

    return { message: 'Sync started', logId: log.id };
  }

  async stopSync(): Promise<any> {
    // TODO: Implement stop sync logic
    return { message: 'Sync stopped' };
  }

  async getSyncStatus(): Promise<any> {
    // TODO: Implement sync status logic
    return { status: 'idle', runningJobs: 0 };
  }
}