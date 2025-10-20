import { Injectable } from '@nestjs/common';
import { BasePlatformAdapter } from './base-platform.adapter';
import { PlatformProduct, PlatformOrder } from '../interfaces/sync.interface';
import axios from 'axios';

@Injectable()
export class WordPressAdapter extends BasePlatformAdapter {
  private username: string;
  private password: string;

  constructor(config: { apiKey: string; apiSecret: string; baseUrl: string; username: string; password: string }) {
    super(config);
    this.username = config.username;
    this.password = config.password;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/wp-json/wc/v3/system_status');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getProducts(page: number = 1, limit: number = 50): Promise<PlatformProduct[]> {
    try {
      const response = await this.makeRequest('/wp-json/wc/v3/products', {
        params: {
          page,
          per_page: limit,
        },
      });

      return response.map((product: any) => this.mapToPlatformProduct(product));
    } catch (error) {
      throw new Error(`Failed to get WordPress products: ${error.message}`);
    }
  }

  async getProduct(id: string): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest(`/wp-json/wc/v3/products/${id}`);
      return this.mapToPlatformProduct(response);
    } catch (error) {
      throw new Error(`Failed to get WordPress product ${id}: ${error.message}`);
    }
  }

  async createProduct(product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest('/wp-json/wc/v3/products', {
        method: 'POST',
        data: this.mapFromPlatformProduct(product),
      });

      return this.mapToPlatformProduct(response);
    } catch (error) {
      throw new Error(`Failed to create WordPress product: ${error.message}`);
    }
  }

  async updateProduct(id: string, product: Partial<PlatformProduct>): Promise<PlatformProduct> {
    try {
      const response = await this.makeRequest(`/wp-json/wc/v3/products/${id}`, {
        method: 'PUT',
        data: this.mapFromPlatformProduct(product),
      });

      return this.mapToPlatformProduct(response);
    } catch (error) {
      throw new Error(`Failed to update WordPress product ${id}: ${error.message}`);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/wp-json/wc/v3/products/${id}`, {
        method: 'DELETE',
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete WordPress product ${id}: ${error.message}`);
    }
  }

  async getOrders(page: number = 1, limit: number = 50): Promise<PlatformOrder[]> {
    try {
      const response = await this.makeRequest('/wp-json/wc/v3/orders', {
        params: {
          page,
          per_page: limit,
        },
      });

      return response.map((order: any) => this.mapToPlatformOrder(order));
    } catch (error) {
      throw new Error(`Failed to get WordPress orders: ${error.message}`);
    }
  }

  async getOrder(id: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest(`/wp-json/wc/v3/orders/${id}`);
      return this.mapToPlatformOrder(response);
    } catch (error) {
      throw new Error(`Failed to get WordPress order ${id}: ${error.message}`);
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<PlatformOrder> {
    try {
      const response = await this.makeRequest(`/wp-json/wc/v3/orders/${id}`, {
        method: 'PUT',
        data: {
          status: this.mapToWooCommerceStatus(status),
        },
      });

      return this.mapToPlatformOrder(response);
    } catch (error) {
      throw new Error(`Failed to update WordPress order ${id}: ${error.message}`);
    }
  }

  protected async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      auth: {
        username: this.username,
        password: this.password,
      },
      params: options.params,
      data: options.data,
    };

    const response = await axios(config);
    return response.data;
  }

  private mapToPlatformProduct(wooProduct: any): PlatformProduct {
    return {
      id: wooProduct.id.toString(),
      name: wooProduct.name,
      description: wooProduct.description,
      price: parseFloat(wooProduct.price),
      inventory: wooProduct.stock_quantity || 0,
      images: wooProduct.images?.map((img: any) => img.src) || [],
      categories: wooProduct.categories?.map((cat: any) => cat.name) || [],
      status: wooProduct.status === 'publish' ? 'active' : 'inactive',
      sku: wooProduct.sku,
      lastUpdated: new Date(wooProduct.date_modified),
    };
  }

  private mapFromPlatformProduct(product: Partial<PlatformProduct>): any {
    return {
      name: product.name,
      description: product.description,
      price: product.price?.toString(),
      stock_quantity: product.inventory,
      images: product.images?.map(url => ({ src: url })) || [],
      categories: product.categories?.map(name => ({ name })) || [],
      status: product.status === 'active' ? 'publish' : 'draft',
      sku: product.sku,
    };
  }

  private mapToPlatformOrder(wooOrder: any): PlatformOrder {
    return {
      id: wooOrder.id.toString(),
      customerName: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
      customerEmail: wooOrder.billing.email,
      customerPhone: wooOrder.billing.phone,
      totalAmount: parseFloat(wooOrder.total),
      currency: wooOrder.currency || 'VND',
      status: this.mapOrderStatus(wooOrder.status),
      paymentStatus: this.mapPaymentStatus(wooOrder.payment_status),
      paymentMethod: wooOrder.payment_method,
      shippingAddress: wooOrder.shipping,
      billingAddress: wooOrder.billing,
      items: wooOrder.line_items?.map((item: any) => ({
        productId: item.product_id.toString(),
        productName: item.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.total),
      })) || [],
      createdAt: new Date(wooOrder.date_created),
      updatedAt: new Date(wooOrder.date_modified),
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap = {
      'pending': 'pending',
      'processing': 'confirmed',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'completed': 'delivered',
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

  private mapToWooCommerceStatus(status: string): string {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'processing',
      'shipped': 'shipped',
      'delivered': 'completed',
      'cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  }
}
