import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TikTokShopAdapter } from '../sync/adapters/tiktok-shop.adapter';
import * as crypto from 'crypto';

@Injectable()
export class TikTokShopAuthService {
  constructor(private readonly config: ConfigService) {}

  private buildAdapter(accessToken?: string) {
    const appKey = this.config.get<string>('TTS_APP_KEY');
    const appSecret = this.config.get<string>('TTS_APP_SECRET');
    const baseUrl = this.config.get<string>('TTS_BASE_URL');
    const authBase = this.config.get<string>('TTS_AUTH_BASE');

    if (!appKey || !appSecret || !baseUrl || !authBase) {
      throw new Error('Missing TikTok Shop configuration. Please check TTS_APP_KEY, TTS_APP_SECRET, TTS_BASE_URL, TTS_AUTH_BASE environment variables.');
    }

    return new TikTokShopAdapter({
      appKey,
      appSecret,
      baseUrl,
      authBase,
      accessToken,
    });
  }

  generateAuthUrl() {
    const adapter = this.buildAdapter();
    const redirect = this.config.get<string>('TTS_REDIRECT_URI');
    
    if (!redirect) {
      throw new Error('TTS_REDIRECT_URI is not configured. Please set it in your .env file.');
    }
    
    const state = crypto.randomBytes(16).toString('hex');
    const url = adapter.buildAuthorizeUrl(redirect, state);
    return { url, state };
  }

  async exchange(code: string) {
    const adapter = this.buildAdapter();
    return adapter.exchangeCodeForToken(code);
  }

  async refresh(refreshToken: string) {
    const adapter = this.buildAdapter();
    return adapter.refreshToken(refreshToken);
  }

  adapterWith(token: string) {
    return this.buildAdapter(token);
  }
}


