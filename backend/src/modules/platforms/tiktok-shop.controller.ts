import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { TikTokShopAuthService } from './tiktok-shop-auth.service';

@Controller('platforms/tiktok-shop')
export class TikTokShopController {
  constructor(private readonly auth: TikTokShopAuthService) {}

  @Get('auth-url')
  getAuthUrl() {
    const { url } = this.auth.generateAuthUrl();
    return { authUrl: url };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.auth.exchange(code);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirect = `${frontend}/platforms/tiktok/success?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    return res.redirect(redirect);
  }

  @Post('test-products')
  async testProducts(@Body() body: { accessToken: string }) {
    const adapter = this.auth.adapterWith(body.accessToken);
    const data = await adapter.listProducts({ page_size: 10, page_number: 1 });
    return data;
  }

  @Post('test-orders')
  async testOrders(@Body() body: { accessToken: string }) {
    const adapter = this.auth.adapterWith(body.accessToken);
    const now = Math.floor(Date.now() / 1000);
    const from = now - 7 * 24 * 3600;
    const data = await adapter.searchOrders({ create_time_from: from, create_time_to: now, page_size: 10 });
    return data;
  }
}


