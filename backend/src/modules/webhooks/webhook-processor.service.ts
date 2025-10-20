import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';
import { Platform } from '../platforms/entities/platform.entity';

export interface WebhookPayload {
  eventType: string;
  platformId: number;
  data: any;
  timestamp: Date;
  signature?: string;
}

@Injectable()
export class WebhookProcessor {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(
    @InjectRepository(WebhookEvent)
    private webhookEventRepository: Repository<WebhookEvent>,
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
  ) {}

  async processWebhook(payload: WebhookPayload): Promise<boolean> {
    try {
      this.logger.log(`Processing webhook event: ${payload.eventType} for platform ${payload.platformId}`);

      // Verify webhook signature if provided
      if (payload.signature) {
        const isValid = await this.verifyWebhookSignature(payload);
        if (!isValid) {
          this.logger.error(`Invalid webhook signature for platform ${payload.platformId}`);
          return false;
        }
      }

      // Save webhook event to database
      const webhookEvent = await this.webhookEventRepository.save({
        platform_id: payload.platformId,
        event_type: payload.eventType,
        payload: payload.data,
        processed: false,
        created_at: new Date(),
      });

      // Process the webhook based on event type
      const processed = await this.processWebhookEvent(webhookEvent);

      // Update webhook event status
      await this.webhookEventRepository.update(webhookEvent.id, {
        processed,
        processed_at: processed ? new Date() : null,
      });

      return processed;
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`, error.stack);
      return false;
    }
  }

  private async verifyWebhookSignature(payload: WebhookPayload): Promise<boolean> {
    try {
      const platform = await this.platformRepository.findOne({
        where: { id: payload.platformId },
      });

      if (!platform || !platform.api_config) {
        return false;
      }

      const webhookSecret = platform.api_config.webhookSecret;
      if (!webhookSecret) {
        return false;
      }

      // TODO: Implement proper signature verification based on platform
      // For now, just return true
      return true;
    } catch (error) {
      this.logger.error(`Failed to verify webhook signature: ${error.message}`);
      return false;
    }
  }

  private async processWebhookEvent(webhookEvent: WebhookEvent): Promise<boolean> {
    try {
      const { event_type, payload } = webhookEvent;

      switch (event_type) {
        case 'order.created':
        case 'order.updated':
        case 'order.cancelled':
          return await this.processOrderWebhook(webhookEvent);
        
        case 'product.created':
        case 'product.updated':
        case 'product.deleted':
          return await this.processProductWebhook(webhookEvent);
        
        case 'inventory.updated':
          return await this.processInventoryWebhook(webhookEvent);
        
        default:
          this.logger.warn(`Unknown webhook event type: ${event_type}`);
          return false;
      }
    } catch (error) {
      this.logger.error(`Failed to process webhook event: ${error.message}`);
      return false;
    }
  }

  private async processOrderWebhook(webhookEvent: WebhookEvent): Promise<boolean> {
    try {
      // TODO: Trigger order sync for the platform
      // This should be implemented with a queue or event system
      this.logger.log(`Order webhook processed for platform ${webhookEvent.platform_id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to process order webhook: ${error.message}`);
      return false;
    }
  }

  private async processProductWebhook(webhookEvent: WebhookEvent): Promise<boolean> {
    try {
      // TODO: Trigger product sync for the platform
      // This should be implemented with a queue or event system
      this.logger.log(`Product webhook processed for platform ${webhookEvent.platform_id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to process product webhook: ${error.message}`);
      return false;
    }
  }

  private async processInventoryWebhook(webhookEvent: WebhookEvent): Promise<boolean> {
    try {
      // TODO: Trigger inventory sync for the platform
      // This should be implemented with a queue or event system
      this.logger.log(`Inventory webhook processed for platform ${webhookEvent.platform_id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to process inventory webhook: ${error.message}`);
      return false;
    }
  }

  async getUnprocessedWebhooks(): Promise<WebhookEvent[]> {
    return this.webhookEventRepository.find({
      where: { processed: false },
      order: { created_at: 'ASC' },
      take: 100,
    });
  }

  async retryFailedWebhooks(): Promise<number> {
    const failedWebhooks = await this.webhookEventRepository.find({
      where: { processed: false },
      order: { created_at: 'ASC' },
      take: 50,
    });

    let retryCount = 0;
    for (const webhook of failedWebhooks) {
      try {
        const processed = await this.processWebhookEvent(webhook);
        if (processed) {
          await this.webhookEventRepository.update(webhook.id, {
            processed: true,
            processed_at: new Date(),
          });
          retryCount++;
        }
      } catch (error) {
        this.logger.error(`Failed to retry webhook ${webhook.id}: ${error.message}`);
      }
    }

    return retryCount;
  }
}
