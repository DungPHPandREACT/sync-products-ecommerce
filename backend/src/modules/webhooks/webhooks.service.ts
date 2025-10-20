import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(WebhookEvent)
    private webhookEventRepository: Repository<WebhookEvent>,
  ) {}

  async findAll(): Promise<WebhookEvent[]> {
    return this.webhookEventRepository.find({
      relations: ['platform'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<WebhookEvent> {
    return this.webhookEventRepository.findOne({
      where: { id },
      relations: ['platform'],
    });
  }

  async create(eventData: Partial<WebhookEvent>): Promise<WebhookEvent> {
    const event = this.webhookEventRepository.create(eventData);
    return this.webhookEventRepository.save(event);
  }

  async markAsProcessed(id: number): Promise<WebhookEvent> {
    await this.webhookEventRepository.update(id, {
      processed: true,
      processed_at: new Date(),
    });
    return this.findOne(id);
  }

  async markAsError(id: number, errorMessage: string): Promise<WebhookEvent> {
    await this.webhookEventRepository.update(id, {
      processed: true,
      processed_at: new Date(),
      error_message: errorMessage,
    });
    return this.findOne(id);
  }
}
