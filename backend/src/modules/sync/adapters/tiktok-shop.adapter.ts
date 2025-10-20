import axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';

type TikTokShopTokenResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    expire_in: number;
    refresh_expires_in: number;
    shop_id_list?: string[];
  };
};

export class TikTokShopAdapter {
  private appKey: string;
  private appSecret: string;
  private baseUrl: string; // https://open-api.tiktokglobalshop.com
  private authBase: string; // https://auth.tiktok-shops.com
  private accessToken?: string;

  constructor(params: {
    appKey: string;
    appSecret: string;
    baseUrl: string;
    authBase: string;
    accessToken?: string;
  }) {
    this.appKey = params.appKey;
    this.appSecret = params.appSecret;
    this.baseUrl = params.baseUrl.replace(/\/$/, '');
    this.authBase = params.authBase.replace(/\/$/, '');
    this.accessToken = params.accessToken;
  }

  buildAuthorizeUrl(redirectUri: string, state: string): string {
    const q = new URLSearchParams({
      app_key: this.appKey,
      state,
      redirect_uri: redirectUri,
    });
    return `${this.authBase}/oauth/authorize?${q.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TikTokShopTokenResponse['data']> {
    const resp = await axios.post<TikTokShopTokenResponse>(
      `${this.authBase}/api/v2/token/get`,
      {
        app_key: this.appKey,
        app_secret: this.appSecret,
        auth_code: code,
        grant_type: 'authorized_code',
      },
    );
    this.accessToken = resp.data.data.access_token;
    return resp.data.data;
  }

  async refreshToken(refreshToken: string): Promise<TikTokShopTokenResponse['data']> {
    const resp = await axios.post<TikTokShopTokenResponse>(
      `${this.authBase}/api/v2/token/refresh`,
      {
        app_key: this.appKey,
        app_secret: this.appSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    );
    this.accessToken = resp.data.data.access_token;
    return resp.data.data;
  }

  // Signing per TikTok Shop doc: concatenate path + sorted query params + body json
  private sign(path: string, query: Record<string, string>, body: unknown): string {
    const sorted = Object.keys(query)
      .sort()
      .reduce((acc, k) => acc + k + query[k], '');
    const bodyStr = body ? JSON.stringify(body) : '';
    const toSign = path + sorted + bodyStr;
    return crypto.createHmac('sha256', this.appSecret).update(toSign).digest('hex');
  }

  private async request(path: string, body: unknown = {}): Promise<any> {
    if (!this.accessToken) throw new Error('Missing access token');
    const urlPath = `/api/v2${path}`;
    const query: Record<string, string> = {
      app_key: this.appKey,
      access_token: this.accessToken,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      sign_method: 'hmac-sha256',
    };
    const sign = this.sign(urlPath, query, body);
    const qs = new URLSearchParams({ ...query, sign }).toString();
    const url = `${this.baseUrl}${urlPath}?${qs}`;
    const cfg: AxiosRequestConfig = { method: 'POST', url, data: body };
    const resp = await axios(cfg);
    return resp.data;
  }

  // Basic test methods
  async listProducts(params: { page_size?: number; page_number?: number } = {}) {
    return this.request('/product/list', params);
  }

  async searchOrders(params: { create_time_from?: number; create_time_to?: number; page_size?: number } = {}) {
    return this.request('/order/search', params);
  }
}
 
