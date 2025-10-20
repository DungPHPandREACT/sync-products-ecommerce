import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { WebhookProcessor } from './webhook-processor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly webhookProcessor: WebhookProcessor,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook events retrieved successfully' })
  findAll() {
    return this.webhooksService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get webhook event by id' })
  @ApiResponse({ status: 200, description: 'Webhook event retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(+id);
  }

  @Post('tiktok')
  @ApiOperation({ summary: 'TikTok webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  async tiktokWebhook(@Body() payload: any) {
    const result = await this.webhookProcessor.processWebhook({
      eventType: 'order.created',
      platformId: 1, // TikTok platform ID
      data: payload,
      timestamp: new Date(),
    });
    return { success: result };
  }

  @Post('shopee')
  @ApiOperation({ summary: 'Shopee webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  async shopeeWebhook(@Body() payload: any) {
    const result = await this.webhookProcessor.processWebhook({
      eventType: 'order.created',
      platformId: 2, // Shopee platform ID
      data: payload,
      timestamp: new Date(),
    });
    return { success: result };
  }

  @Post('lazada')
  @ApiOperation({ summary: 'Lazada webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  async lazadaWebhook(@Body() payload: any) {
    const result = await this.webhookProcessor.processWebhook({
      eventType: 'order.created',
      platformId: 3, // Lazada platform ID
      data: payload,
      timestamp: new Date(),
    });
    return { success: result };
  }
}
