import { Injectable } from '@nestjs/common';
import { BasePlatformAdapter } from './base-platform.adapter';
import { PlatformProduct, PlatformOrder } from '../interfaces/sync.interface';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ShopeeAdapter extends BasePlatformAdapter {
  private partnerId: string;
  private shopId: string;

  constructor(config: { apiKey: string; apiSecret: string; baseUrl: string; partnerId: string; shopId: string }) {
    super(config);
    this.partnerId = config.partnerId;
    this.shopId = config.shopId;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/v2/shop/get_shop_info');
      return response.error === undefined;
    } catch (error) {
      return false;
    }
  }

  async getProducts(page: number = 1, limit: number = 50): Promise<PlatformProduct[]> {
    try {
      const response = await this.makeRequest('/api/v2/product/get_item_list', {
        method: 'POST',
        data: {
          page_size: limit,
          page_number: page,
        },
      });

      return response.response.item_list.map((item: any) => this.mapToPlatformProduct(item));
    } catch (error) {
      throw new Error(`Failed to get Shopee products: ${error.message}`);
    }
  }

  async getProduct(id: string): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/api/v2/product/get_item_detail', {
        method: 'POST',
        data: { item_id: parseInt(id) },
      });

      return this.mapToPlatformProduct(response.response.item);
    } catch (error) {
      throw new Error(`Failed to get Shopee product ${id}: ${error.message}`);
    }
  }

  async createProduct(product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/api/v2/product/add_item', {
        method: 'POST',
        data: this.mapFromPlatformProduct(product),
      });

      return this.mapToPlatformProduct(response.response.item);
    } catch (error) {
      throw new Error(`Failed to create Shopee product: ${error.message}`);
    }
  }

  async updateProduct(id: string, product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/api/v2/product/update_item', {
        method: 'POST',
        data: {
          item_id: parseInt(id),
          ...this.mapFromPlatformProduct(product),
        },
      });

      return this.mapToPlatformProduct(response.response.item);
    } catch (error) {
      throw new Error(`Failed to update Shopee product ${id}: ${error.message}`);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.makeRequest('/api/v2/product/delete_item', {
        method: 'POST',
        data: { item_id: parseInt(id) },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete Shopee product ${id}: ${error.message}`);
    }
  }

  async getOrders(page: number = 1, limit: number = 50): Promise<PlatformOrder[]> {
    try {
      const response = await this.makeRequest('/api/v2/order/get_order_list', {
        method: 'POST',
        data: {
          page_size: limit,
          page_number: page,
        },
      });

      return response.response.order_list.map((order: any) => this.mapToPlatformOrder(order));
    } catch (error) {
      throw new Error(`Failed to get Shopee orders: ${error.message}`);
    }
  }

  async getOrder(id: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest('/api/v2/order/get_order_detail', {
        method: 'POST',
        data: { order_sn: id },
      });

      return this.mapToPlatformOrder(response.response.order);
    } catch (error) {
      throw new Error(`Failed to get Shopee order ${id}: ${error.message}`);
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest('/api/v2/order/update_order_status', {
        method: 'POST',
        data: {
          order_sn: id,
          order_status: this.mapToShopeeStatus(status),
        },
      });

      return this.mapToPlatformOrder(response.response.order);
    } catch (error) {
      throw new Error(`Failed to update Shopee order ${id}: ${error.message}`);
    }
  }

  protected async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000);
    const baseString = `${this.partnerId}${endpoint}${timestamp}`;
    const signature = crypto.createHmac('sha256', this.apiSecret).update(baseString).digest('hex');

    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      url,
      method: options.method || 'GET',
      headers: {
        'Authorization': `SHA256 ${this.partnerId}:${signature}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      params: {
        partner_id: this.partnerId,
        shop_id: this.shopId,
        timestamp,
        ...options.params,
      },
      ...options,
    };

    const response = await axios(config);
    return response.data;
  }

  private mapToPlatformProduct(shopeeItem: any): PlatformProduct {
    return {
      id: shopeeItem.item_id.toString(),
      name: shopeeItem.item_name,
      description: shopeeItem.description,
      price: parseFloat(shopeeItem.price_info.price),
      inventory: shopeeItem.stock_info.total_stock,
      images: shopeeItem.image_list?.map((img: any) => img.url) || [],
      categories: [shopeeItem.category_name],
      status: shopeeItem.status === 'NORMAL' ? 'active' : 'inactive',
      sku: shopeeItem.item_sku,
      lastUpdated: new Date(shopeeItem.update_time * 1000),
    };
  }

  private mapFromPlatformProduct(product: Partial<PlatformProduct>): any {
    return {
      item_name: product.name,
      description: product.description,
      price_info: {
        price: product.price,
        currency: 'VND',
      },
      stock_info: {
        total_stock: product.inventory,
      },
      image_list: product.images?.map(url => ({ url })) || [],
      category_name: product.categories?.[0] || '',
      status: product.status === 'active' ? 'NORMAL' : 'INACTIVE',
      item_sku: product.sku,
    };
  }

  private mapToPlatformOrder(shopeeOrder: any): PlatformOrder {
    return {
      id: shopeeOrder.order_sn,
      customerName: shopeeOrder.recipient_address?.name || '',
      customerEmail: shopeeOrder.recipient_address?.email || '',
      customerPhone: shopeeOrder.recipient_address?.phone || '',
      totalAmount: parseFloat(shopeeOrder.total_amount),
      currency: shopeeOrder.currency || 'VND',
      status: this.mapOrderStatus(shopeeOrder.order_status),
      paymentStatus: this.mapPaymentStatus(shopeeOrder.payment_status),
      paymentMethod: shopeeOrder.payment_method,
      shippingAddress: shopeeOrder.recipient_address,
      billingAddress: shopeeOrder.recipient_address,
      items: shopeeOrder.item_list?.map((item: any) => ({
        productId: item.item_id.toString(),
        productName: item.item_name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.total_price),
      })) || [],
      createdAt: new Date(shopeeOrder.create_time * 1000),
      updatedAt: new Date(shopeeOrder.update_time * 1000),
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap = {
      'UNPAID': 'pending',
      'READY_TO_SHIP': 'confirmed',
      'SHIPPED': 'shipped',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
    };
    return statusMap[status] || 'pending';
  }

  private mapPaymentStatus(status: string): string {
    const statusMap = {
      'UNPAID': 'pending',
      'PAID': 'paid',
      'PAYMENT_FAILED': 'failed',
      'REFUNDED': 'refunded',
    };
    return statusMap[status] || 'pending';
  }

  private mapToShopeeStatus(status: string): string {
    const statusMap = {
      'pending': 'UNPAID',
      'confirmed': 'READY_TO_SHIP',
      'shipped': 'SHIPPED',
      'delivered': 'DELIVERED',
      'cancelled': 'CANCELLED',
    };
    return statusMap[status] || 'UNPAID';
  }
}
