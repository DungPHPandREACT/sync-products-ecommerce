import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SyncEngine } from './sync-engine.service';

@Processor('sync')
export class SyncProcessor {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(private readonly syncEngine: SyncEngine) {}

  @Process('sync-job')
  async handleSyncJob(job: any) {
    this.logger.log(`Processing sync job: ${job.data.jobId}`);
    
    try {
      const result = await this.syncEngine.processSyncJob(job.data);
      
      if (result.success) {
        this.logger.log(`Sync job ${job.data.jobId} completed successfully`);
      } else {
        this.logger.warn(`Sync job ${job.data.jobId} completed with errors: ${result.errors.join(', ')}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Sync job ${job.data.jobId} failed: ${error.message}`);
      throw error;
    }
  }
}
