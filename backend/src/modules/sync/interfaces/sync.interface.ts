export interface SyncConfig {
  platformId: number;
  syncType: 'products' | 'orders' | 'inventory' | 'all';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  batchSize: number;
  maxRetries: number;
  conflictResolution: 'local' | 'platform' | 'manual';
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccess: number;
  recordsFailed: number;
  conflicts: SyncConflict[];
  errors: string[];
  duration: number;
}

export interface SyncConflict {
  id?: number;
  productMappingId: number;
  conflictType: 'price' | 'inventory' | 'status' | 'description' | 'name';
  localValue: any;
  platformValue: any;
  resolution: 'pending' | 'local' | 'platform' | 'manual';
  resolvedBy?: number;
  resolvedAt?: Date;
}

export interface PlatformProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  images?: string[];
  categories?: string[];
  status: string;
  sku?: string;
  lastUpdated: Date;
}

export interface PlatformOrder {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  shippingAddress?: any;
  billingAddress?: any;
  items: PlatformOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SyncJob {
  id: string;
  platformId: number;
  syncType: string;
  direction: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface SyncStats {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  pendingJobs: number;
  totalConflicts: number;
  resolvedConflicts: number;
  pendingConflicts: number;
  lastSyncTime?: Date;
}
