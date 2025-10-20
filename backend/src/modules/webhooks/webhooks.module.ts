import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { WebhookProcessor } from './webhook-processor.service';
import { Platform } from '../platforms/entities/platform.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEvent, Platform]),
    SharedModule,
  ],
  providers: [WebhooksService, WebhookProcessor],
  controllers: [WebhooksController],
  exports: [WebhooksService, WebhookProcessor],
})
export class WebhooksModule {}
