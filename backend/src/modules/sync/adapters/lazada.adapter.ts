import { Injectable } from '@nestjs/common';
import { BasePlatformAdapter } from './base-platform.adapter';
import { PlatformProduct, PlatformOrder } from '../interfaces/sync.interface';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class LazadaAdapter extends BasePlatformAdapter {
  private accessToken: string;

  constructor(config: { apiKey: string; apiSecret: string; baseUrl: string }) {
    super(config);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/product/get');
      return response.success === true;
    } catch (error) {
      return false;
    }
  }

  async getProducts(page: number = 1, limit: number = 50): Promise<PlatformProduct[]> {
    try {
      const response = await this.makeRequest('/product/get', {
        method: 'POST',
        data: {
          page_size: limit,
          page_number: page,
        },
      });

      return response.data.products.map((product: any) => this.mapToPlatformProduct(product));
    } catch (error) {
      throw new Error(`Failed to get Lazada products: ${error.message}`);
    }
  }

  async getProduct(id: string): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/product/get', {
        method: 'POST',
        data: { item_id: id },
      });

      return this.mapToPlatformProduct(response.data);
    } catch (error) {
      throw new Error(`Failed to get Lazada product ${id}: ${error.message}`);
    }
  }

  async createProduct(product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/product/create', {
        method: 'POST',
        data: this.mapFromPlatformProduct(product),
      });

      return this.mapToPlatformProduct(response.data);
    } catch (error) {
      throw new Error(`Failed to create Lazada product: ${error.message}`);
    }
  }

  async updateProduct(id: string, product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/product/update', {
        method: 'POST',
        data: {
          item_id: id,
          ...this.mapFromPlatformProduct(product),
        },
      });

      return this.mapToPlatformProduct(response.data);
    } catch (error) {
      throw new Error(`Failed to update Lazada product ${id}: ${error.message}`);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.makeRequest('/product/remove', {
        method: 'POST',
        data: { item_id: id },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete Lazada product ${id}: ${error.message}`);
    }
  }

  async getOrders(page: number = 1, limit: number = 50): Promise<PlatformOrder[]> {
    try {
      const response = await this.makeRequest('/order/get', {
        method: 'POST',
        data: {
          page_size: limit,
          page_number: page,
        },
      });

      return response.data.orders.map((order: any) => this.mapToPlatformOrder(order));
    } catch (error) {
      throw new Error(`Failed to get Lazada orders: ${error.message}`);
    }
  }

  async getOrder(id: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest('/order/get', {
        method: 'POST',
        data: { order_id: id },
      });

      return this.mapToPlatformOrder(response.data);
    } catch (error) {
      throw new Error(`Failed to get Lazada order ${id}: ${error.message}`);
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest('/order/update_status', {
        method: 'POST',
        data: {
          order_id: id,
          status: this.mapToLazadaStatus(status),
        },
      });

      return this.mapToPlatformOrder(response.data);
    } catch (error) {
      throw new Error(`Failed to update Lazada order ${id}: ${error.message}`);
    }
  }

  protected async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const timestamp = Date.now();
    const params = {
      app_key: this.apiKey,
      timestamp,
      access_token: this.accessToken,
      ...options.params,
    };

    // Sort parameters for signature
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('');

    const signature = crypto.createHmac('sha256', this.apiSecret)
      .update(sortedParams)
      .digest('hex')
      .toUpperCase();

    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      params: {
        ...params,
        sign: signature,
      },
      ...options,
    };

    const response = await axios(config);
    return response.data;
  }

  private mapToPlatformProduct(lazadaProduct: any): PlatformProduct {
    return {
      id: lazadaProduct.item_id,
      name: lazadaProduct.item_name,
      description: lazadaProduct.description,
      price: parseFloat(lazadaProduct.price),
      inventory: lazadaProduct.stock_quantity,
      images: lazadaProduct.images?.map((img: any) => img.url) || [],
      categories: [lazadaProduct.category_name],
      status: lazadaProduct.status === 'active' ? 'active' : 'inactive',
      sku: lazadaProduct.seller_sku,
      lastUpdated: new Date(lazadaProduct.updated_time),
    };
  }

  private mapFromPlatformProduct(product: Partial<PlatformProduct>): any {
    return {
      item_name: product.name,
      description: product.description,
      price: product.price?.toString(),
      stock_quantity: product.inventory,
      images: product.images?.map(url => ({ url })) || [],
      category_name: product.categories?.[0] || '',
      status: product.status === 'active' ? 'active' : 'inactive',
      seller_sku: product.sku,
    };
  }

  private mapToPlatformOrder(lazadaOrder: any): PlatformOrder {
    return {
      id: lazadaOrder.order_id,
      customerName: lazadaOrder.customer_name || '',
      customerEmail: lazadaOrder.customer_email || '',
      customerPhone: lazadaOrder.customer_phone || '',
      totalAmount: parseFloat(lazadaOrder.total_amount),
      currency: lazadaOrder.currency || 'VND',
      status: this.mapOrderStatus(lazadaOrder.status),
      paymentStatus: this.mapPaymentStatus(lazadaOrder.payment_status),
      paymentMethod: lazadaOrder.payment_method,
      shippingAddress: lazadaOrder.shipping_address,
      billingAddress: lazadaOrder.billing_address,
      items: lazadaOrder.order_items?.map((item: any) => ({
        productId: item.item_id,
        productName: item.item_name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.total_price),
      })) || [],
      createdAt: new Date(lazadaOrder.created_at),
      updatedAt: new Date(lazadaOrder.updated_at),
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  }

  private mapPaymentStatus(status: string): string {
    const statusMap = {
      'pending': 'pending',
      'paid': 'paid',
      'failed': 'failed',
      'refunded': 'refunded',
    };
    return statusMap[status] || 'pending';
  }

  private mapToLazadaStatus(status: string): string {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  }
}
