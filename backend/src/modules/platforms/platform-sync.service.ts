import { Injectable } from '@nestjs/common';
import { SyncEngine } from '../sync/sync-engine.service';

@Injectable()
export class PlatformSyncService {
  constructor(
    private syncEngine: SyncEngine,
  ) {}

  async syncPlatform(id: number): Promise<any> {
    try {
      const result = await this.syncEngine.startSync({
        platformId: id,
        syncType: 'all',
        direction: 'bidirectional',
        batchSize: 50,
        maxRetries: 3,
        conflictResolution: 'manual',
      });
      
      return { 
        success: true, 
        message: 'Platform sync started',
        platformId: id,
        jobId: result.id
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to start sync: ${error.message}`,
        platformId: id 
      };
    }
  }
}
