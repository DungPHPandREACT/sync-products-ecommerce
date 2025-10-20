import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platform } from './entities/platform.entity';
import { PlatformAdapterFactory } from '../sync/adapters/platform-adapter.factory';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
    private platformAdapterFactory: PlatformAdapterFactory,
  ) {}

  async findAll(): Promise<Platform[]> {
    return this.platformRepository.find();
  }

  async findOne(id: number): Promise<Platform> {
    return this.platformRepository.findOne({ where: { id } });
  }

  async create(platformData: Partial<Platform>): Promise<Platform> {
    const platform = this.platformRepository.create(platformData);
    return this.platformRepository.save(platform);
  }

  async update(id: number, platformData: Partial<Platform>): Promise<Platform> {
    await this.platformRepository.update(id, platformData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.platformRepository.delete(id);
  }

  async getStats(): Promise<any[]> {
    // TODO: Implement platform stats
    return [
      { platform_id: 1, platform_name: 'TikTok', total_products: 0, total_orders: 0, last_sync: 'Never', sync_status: 'inactive' },
      { platform_id: 2, platform_name: 'Shopee', total_products: 0, total_orders: 0, last_sync: 'Never', sync_status: 'inactive' },
      { platform_id: 3, platform_name: 'Lazada', total_products: 0, total_orders: 0, last_sync: 'Never', sync_status: 'inactive' },
      { platform_id: 4, platform_name: 'WordPress', total_products: 0, total_orders: 0, last_sync: 'Never', sync_status: 'inactive' },
    ];
  }

  async testConnection(id: number): Promise<any> {
    try {
      const isConnected = await this.platformAdapterFactory.testPlatformConnection(id);
      return { 
        success: isConnected, 
        message: isConnected ? 'Connection test successful' : 'Connection test failed',
        platformId: id 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection test failed: ${error.message}`,
        platformId: id 
      };
    }
  }

  async syncPlatform(id: number): Promise<any> {
    // This method will be handled by PlatformSyncService
    throw new Error('Use PlatformSyncService.syncPlatform instead');
  }
}
