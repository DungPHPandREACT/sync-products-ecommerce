export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  price: number | null;
  inventory: number;
  images: string[] | null;
  categories: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  product_mappings?: Array<
    Partial<IProductMapping> & {
      id: number;
      platform?: { display_name?: string };
    }
  >; // optional relation for UI
}

export interface ICreateProductPayload {
  name: string;
  description?: string | null;
  sku?: string | null;
  price?: number | null;
  inventory?: number;
  images?: string[] | null;
  categories?: string[] | null;
  status?: string;
}

export interface IUpdateProductPayload extends Partial<ICreateProductPayload> {}

export interface IProductMapping {
  id: number;
  product_id: number;
  platform_id: number;
  platform_product_id: string | null;
  platform_data: Record<string, any> | null;
  sync_status: string;
  last_synced_at: string | null;
  sync_direction: string;
  created_at: string;
  updated_at: string;
}

export interface ISyncProductPayload {
  platformId: number;
}
