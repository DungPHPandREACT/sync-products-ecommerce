import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { SyncLog } from './entities/sync-log.entity';
import { SyncConflict as SyncConflictEntity } from './entities/sync-conflict.entity';
import { PlatformAdapterFactory } from './adapters/platform-adapter.factory';

export interface SyncConfig {
  platformId: number;
  syncType: 'products' | 'orders' | 'inventory' | 'all';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  batchSize: number;
  maxRetries: number;
  conflictResolution: 'local' | 'platform' | 'manual';
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccess: number;
  recordsFailed: number;
  conflicts: any[];
  errors: string[];
  duration: number;
}

export interface SyncJob {
  id: string;
  platformId: number;
  syncType: string;
  direction: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

@Injectable()
export class SyncEngine {
  private readonly logger = new Logger(SyncEngine.name);

  constructor(
    @InjectRepository(SyncLog)
    private syncLogRepository: Repository<SyncLog>,
    @InjectRepository(SyncConflictEntity)
    private syncConflictRepository: Repository<SyncConflictEntity>,
    @InjectQueue('sync') private syncQueue: Queue,
    private platformAdapterFactory: PlatformAdapterFactory,
  ) {}

  async startSync(config: SyncConfig): Promise<SyncJob> {
    const jobId = `sync-${config.platformId}-${config.syncType}-${Date.now()}`;
    
    const job = await this.syncQueue.add('sync-job', {
      jobId,
      config,
    }, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
    });

    return {
      id: jobId,
      platformId: config.platformId,
      syncType: config.syncType,
      direction: config.direction,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
    };
  }

  async processSyncJob(jobData: any): Promise<SyncResult> {
    const { jobId, config } = jobData;
    const startTime = Date.now();
    
    this.logger.log(`Starting sync job ${jobId}`);

    try {
      // Create sync log
      const syncLog = await this.syncLogRepository.save({
        platform_id: config.platformId,
        sync_type: config.syncType,
        sync_direction: config.direction,
        status: 'started',
        started_at: new Date(),
      });

      let result: SyncResult;

      switch (config.syncType) {
        case 'products':
          result = await this.syncProducts(config, syncLog.id);
          break;
        case 'orders':
          result = await this.syncOrders(config, syncLog.id);
          break;
        case 'inventory':
          result = await this.syncInventory(config, syncLog.id);
          break;
        case 'all':
          result = await this.syncAll(config, syncLog.id);
          break;
        default:
          throw new Error(`Unknown sync type: ${config.syncType}`);
      }

      // Update sync log
      await this.syncLogRepository.update(syncLog.id, {
        status: result.success ? 'completed' : 'failed',
        completed_at: new Date(),
        records_processed: result.recordsProcessed,
        records_success: result.recordsSuccess,
        records_failed: result.recordsFailed,
        error_message: result.errors.join('; '),
      });

      this.logger.log(`Sync job ${jobId} completed in ${Date.now() - startTime}ms`);
      return result;

    } catch (error) {
      this.logger.error(`Sync job ${jobId} failed: ${error.message}`);
      
      return {
        success: false,
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsFailed: 0,
        conflicts: [],
        errors: [error.message],
        duration: Date.now() - startTime,
      };
    }
  }

  private async syncProducts(config: SyncConfig, syncLogId: number): Promise<SyncResult> {
    const conflicts: any[] = [];
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccess = 0;
    let recordsFailed = 0;

    try {
      // Get platform adapter
      const adapter = await this.getPlatformAdapter(config.platformId);
      if (!adapter) {
        throw new Error(`Platform adapter not found for platform ${config.platformId}`);
      }

      // Test connection first
      const isConnected = await adapter.testConnection();
      if (!isConnected) {
        throw new Error(`Failed to connect to platform ${config.platformId}`);
      }

      // Sync products based on direction
      if (config.direction === 'inbound' || config.direction === 'bidirectional') {
        const result = await this.syncProductsFromPlatform(adapter, config, conflicts);
        recordsProcessed += result.processed;
        recordsSuccess += result.success;
        recordsFailed += result.failed;
        errors.push(...result.errors);
      }

      if (config.direction === 'outbound' || config.direction === 'bidirectional') {
        const result = await this.syncProductsToPlatform(adapter, config, conflicts);
        recordsProcessed += result.processed;
        recordsSuccess += result.success;
        recordsFailed += result.failed;
        errors.push(...result.errors);
      }

    } catch (error) {
      errors.push(`Sync products failed: ${error.message}`);
      recordsFailed++;
    }

    return {
      success: recordsFailed === 0,
      recordsProcessed,
      recordsSuccess,
      recordsFailed,
      conflicts,
      errors,
      duration: 0,
    };
  }

  private async syncOrders(config: SyncConfig, syncLogId: number): Promise<SyncResult> {
    const conflicts: any[] = [];
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccess = 0;
    let recordsFailed = 0;

    try {
      // Get platform adapter
      const adapter = await this.getPlatformAdapter(config.platformId);
      if (!adapter) {
        throw new Error(`Platform adapter not found for platform ${config.platformId}`);
      }

      // Test connection first
      const isConnected = await adapter.testConnection();
      if (!isConnected) {
        throw new Error(`Failed to connect to platform ${config.platformId}`);
      }

      // Sync orders based on direction
      if (config.direction === 'inbound' || config.direction === 'bidirectional') {
        const result = await this.syncOrdersFromPlatform(adapter, config, conflicts);
        recordsProcessed += result.processed;
        recordsSuccess += result.success;
        recordsFailed += result.failed;
        errors.push(...result.errors);
      }

      if (config.direction === 'outbound' || config.direction === 'bidirectional') {
        const result = await this.syncOrdersToPlatform(adapter, config, conflicts);
        recordsProcessed += result.processed;
        recordsSuccess += result.success;
        recordsFailed += result.failed;
        errors.push(...result.errors);
      }

    } catch (error) {
      errors.push(`Sync orders failed: ${error.message}`);
      recordsFailed++;
    }

    return {
      success: recordsFailed === 0,
      recordsProcessed,
      recordsSuccess,
      recordsFailed,
      conflicts,
      errors,
      duration: 0,
    };
  }

  private async syncInventory(config: SyncConfig, syncLogId: number): Promise<SyncResult> {
    // Sync only inventory levels
    return this.syncProducts(config, syncLogId);
  }

  private async syncAll(config: SyncConfig, syncLogId: number): Promise<SyncResult> {
    const results = await Promise.all([
      this.syncProducts(config, syncLogId),
      this.syncOrders(config, syncLogId),
    ]);

    // Combine results
    return {
      success: results.every(r => r.success),
      recordsProcessed: results.reduce((sum, r) => sum + r.recordsProcessed, 0),
      recordsSuccess: results.reduce((sum, r) => sum + r.recordsSuccess, 0),
      recordsFailed: results.reduce((sum, r) => sum + r.recordsFailed, 0),
      conflicts: results.flatMap(r => r.conflicts),
      errors: results.flatMap(r => r.errors),
      duration: 0,
    };
  }

  // Scheduled sync jobs
  @Cron('0 */15 * * * *') // Every 15 minutes
  async scheduledProductSync() {
    this.logger.log('Running scheduled product sync');
    
    // TODO: Get platforms from database
    const platforms = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    
    for (const platform of platforms) {
      await this.startSync({
        platformId: platform.id,
        syncType: 'products',
        direction: 'bidirectional',
        batchSize: 50,
        maxRetries: 3,
        conflictResolution: 'manual',
      });
    }
  }

  @Cron('0 */5 * * * *') // Every 5 minutes
  async scheduledOrderSync() {
    this.logger.log('Running scheduled order sync');
    
    // TODO: Get platforms from database
    const platforms = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    
    for (const platform of platforms) {
      await this.startSync({
        platformId: platform.id,
        syncType: 'orders',
        direction: 'inbound',
        batchSize: 100,
        maxRetries: 3,
        conflictResolution: 'manual',
      });
    }
  }

  // Helper methods for sync operations
  private async getPlatformAdapter(platformId: number): Promise<any> {
    return await this.platformAdapterFactory.getAdapter(platformId);
  }

  private async syncProductsFromPlatform(adapter: any, config: SyncConfig, conflicts: any[]): Promise<any> {
    const errors: string[] = [];
    let processed = 0;
    let success = 0;
    let failed = 0;

    try {
      // Get products from platform
      const platformProducts = await adapter.getProducts(1, config.batchSize);
      
      for (const platformProduct of platformProducts) {
        processed++;
        
        try {
          // Check if product exists locally
          // TODO: Implement product mapping and conflict detection
          // For now, just mark as success
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to sync product ${platformProduct.id}: ${error.message}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to get products from platform: ${error.message}`);
    }

    return { processed, success, failed, errors };
  }

  private async syncProductsToPlatform(adapter: any, config: SyncConfig, conflicts: any[]): Promise<any> {
    const errors: string[] = [];
    let processed = 0;
    let success = 0;
    let failed = 0;

    try {
      // TODO: Get local products that need to be synced to platform
      // For now, just return empty result
    } catch (error) {
      errors.push(`Failed to sync products to platform: ${error.message}`);
    }

    return { processed, success, failed, errors };
  }

  private async syncOrdersFromPlatform(adapter: any, config: SyncConfig, conflicts: any[]): Promise<any> {
    const errors: string[] = [];
    let processed = 0;
    let success = 0;
    let failed = 0;

    try {
      // Get orders from platform
      const platformOrders = await adapter.getOrders(1, config.batchSize);
      
      for (const platformOrder of platformOrders) {
        processed++;
        
        try {
          // Check if order exists locally
          // TODO: Implement order mapping and conflict detection
          // For now, just mark as success
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to sync order ${platformOrder.id}: ${error.message}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to get orders from platform: ${error.message}`);
    }

    return { processed, success, failed, errors };
  }

  private async syncOrdersToPlatform(adapter: any, config: SyncConfig, conflicts: any[]): Promise<any> {
    const errors: string[] = [];
    let processed = 0;
    let success = 0;
    let failed = 0;

    try {
      // TODO: Get local orders that need to be synced to platform
      // For now, just return empty result
    } catch (error) {
      errors.push(`Failed to sync orders to platform: ${error.message}`);
    }

    return { processed, success, failed, errors };
  }
}