import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Platform } from './entities/platform.entity';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { PlatformSyncService } from './platform-sync.service';
// Removed classic TikTok (consumer) wiring
import { TikTokShopAuthService } from './tiktok-shop-auth.service';
import { TikTokShopController } from './tiktok-shop.controller';
import { SharedModule } from '../shared/shared.module';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Platform]),
    ConfigModule,
    SharedModule,
    SyncModule,
  ],
  providers: [PlatformsService, PlatformSyncService, TikTokShopAuthService],
  controllers: [PlatformsController, TikTokShopController],
  exports: [PlatformsService, PlatformSyncService, TikTokShopAuthService],
})
export class PlatformsModule {}
