export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_mapping_id: number | null;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
  created_at: string;
}

export interface IOrder {
  id: number;
  platform_id: number;
  platform_order_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: Record<string, any> | null;
  billing_address: Record<string, any> | null;
  total_amount: number | null;
  currency: string;
  status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: IOrderItem[];
}

export interface ICreateOrderPayload {
  platform_id: number;
  platform_order_id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  shipping_address?: Record<string, any> | null;
  billing_address?: Record<string, any> | null;
  total_amount?: number | null;
  currency?: string;
  status?: string | null;
  payment_status?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  order_items?: Array<{
    product_id?: number | null;
    product_mapping_id?: number | null;
    quantity: number;
    unit_price?: number | null;
    total_price?: number | null;
  }>;
}

export interface IUpdateOrderPayload extends Partial<ICreateOrderPayload> {}

export interface ISyncOrdersPayload {
  platformId?: number;
}

export interface IUpdateOrderStatusPayload {
  status: string;
}
