import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

// Entities
import { Platform } from './modules/platforms/entities/platform.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductMapping } from './modules/products/entities/product-mapping.entity';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';
import { SyncLog } from './modules/sync/entities/sync-log.entity';
import { SyncConflict } from './modules/sync/entities/sync-conflict.entity';
import { WebhookEvent } from './modules/webhooks/entities/webhook-event.entity';

const useSync = (process.env.TYPEORM_SYNC ?? 'false') === 'true';

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sync_products_ecommerce',
  entities: [
    Platform,
    Product,
    ProductMapping,
    Order,
    OrderItem,
    SyncLog,
    SyncConflict,
    WebhookEvent,
  ],
  // Khi TYPEORM_SYNC=true để auto tạo bảng, không load migrations tránh lỗi và tăng tốc
  migrations: useSync ? [] : ['dist/src/migrations/*.js'],
};


