import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platform } from '../../platforms/entities/platform.entity';
import { ShopeeAdapter } from './shopee.adapter';
import { LazadaAdapter } from './lazada.adapter';
import { WordPressAdapter } from './wordpress.adapter';
import { PlatformAdapter } from './base-platform.adapter';

@Injectable()
export class PlatformAdapterFactory {
  constructor(
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
  ) {}

  async getAdapter(platformId: number): Promise<PlatformAdapter | null> {
    try {
      const platform = await this.platformRepository.findOne({
        where: { id: platformId },
      });

      if (!platform) {
        throw new Error(`Platform with id ${platformId} not found`);
      }

      const config = this.extractConfig(platform);
      
      switch (platform.name) {
        case 'shopee':
          return new ShopeeAdapter(config);
        // TikTok Shop is handled by dedicated service, not generic factory
        case 'lazada':
          return new LazadaAdapter(config);
        case 'wordpress':
          return new WordPressAdapter(config);
        default:
          throw new Error(`Unsupported platform: ${platform.name}`);
      }
    } catch (error) {
      console.error(`Failed to create adapter for platform ${platformId}:`, error);
      return null;
    }
  }

  private extractConfig(platform: Platform): any {
    const apiConfig = platform.api_config || {};
    
    return {
      apiKey: apiConfig.apiKey || '',
      apiSecret: apiConfig.apiSecret || '',
      baseUrl: apiConfig.baseUrl || '',
      // Platform-specific configs
      ...(platform.name === 'shopee' && {
        partnerId: apiConfig.partnerId || '',
        shopId: apiConfig.shopId || '',
      }),
      ...(platform.name === 'wordpress' && {
        username: apiConfig.username || '',
        password: apiConfig.password || '',
      }),
    };
  }

  async testPlatformConnection(platformId: number): Promise<boolean> {
    try {
      const adapter = await this.getAdapter(platformId);
      if (!adapter) {
        return false;
      }
      
      return await adapter.testConnection();
    } catch (error) {
      console.error(`Failed to test connection for platform ${platformId}:`, error);
      return false;
    }
  }

  async getSupportedPlatforms(): Promise<string[]> {
    return ['shopee', 'lazada', 'wordpress'];
  }
}
