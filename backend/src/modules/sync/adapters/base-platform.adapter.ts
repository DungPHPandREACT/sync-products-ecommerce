import { Injectable } from '@nestjs/common';
import { PlatformProduct, PlatformOrder } from '../interfaces/sync.interface';

export interface PlatformAdapter {
  getProducts(page?: number, limit?: number): Promise<PlatformProduct[]>;
  getProduct(id: string): Promise<PlatformProduct>;
  createProduct(product: Partial<PlatformProduct>): Promise<PlatformProduct>;
  updateProduct(id: string, product: Partial<PlatformProduct>): Promise<PlatformProduct>;
  deleteProduct(id: string): Promise<boolean>;
  
  getOrders(page?: number, limit?: number): Promise<PlatformOrder[]>;
  getOrder(id: string): Promise<PlatformOrder>;
  updateOrderStatus(id: string, status: string): Promise<PlatformOrder>;
  
  testConnection(): Promise<boolean>;
}

@Injectable()
export abstract class BasePlatformAdapter implements PlatformAdapter {
  protected apiKey: string;
  protected apiSecret: string;
  protected baseUrl: string;

  constructor(config: { apiKey: string; apiSecret: string; baseUrl: string }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl;
  }

  abstract getProducts(page?: number, limit?: number): Promise<PlatformProduct[]>;
  abstract getProduct(id: string): Promise<PlatformProduct>;
  abstract createProduct(product: Partial<PlatformProduct>): Promise<PlatformProduct>;
  abstract updateProduct(id: string, product: Partial<PlatformProduct>): Promise<PlatformProduct>;
  abstract deleteProduct(id: string): Promise<boolean>;
  
  abstract getOrders(page?: number, limit?: number): Promise<PlatformOrder[]>;
  abstract getOrder(id: string): Promise<PlatformOrder>;
  abstract updateOrderStatus(id: string, status: string): Promise<PlatformOrder>;
  
  abstract testConnection(): Promise<boolean>;

  protected async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    // Base implementation for making HTTP requests
    // Each platform will override this with their specific implementation
    throw new Error('makeRequest must be implemented by platform adapter');
  }
}
