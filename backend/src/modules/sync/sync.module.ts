import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { SyncEngine } from './sync-engine.service';
import { SyncProcessor } from './sync.processor';
import { SharedModule } from '../shared/shared.module';

import { SyncLog } from './entities/sync-log.entity';
import { SyncConflict } from './entities/sync-conflict.entity';
import { Product } from '../products/entities/product.entity';
import { ProductMapping } from '../products/entities/product-mapping.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Platform } from '../platforms/entities/platform.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SyncLog,
      SyncConflict,
      Product,
      ProductMapping,
      Order,
      OrderItem,
      Platform,
    ]),
    BullModule.registerQueue({
      name: 'sync',
    }),
    ScheduleModule.forRoot(),
    SharedModule,
  ],
  providers: [SyncService, SyncEngine, SyncProcessor],
  controllers: [SyncController],
  exports: [SyncService, SyncEngine],
})
export class SyncModule {}
