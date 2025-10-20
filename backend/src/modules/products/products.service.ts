import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductMapping } from './entities/product-mapping.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductMapping)
    private productMappingRepository: Repository<ProductMapping>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['product_mappings', 'product_mappings.platform'],
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['product_mappings', 'product_mappings.platform'],
    });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async syncProduct(id: number, platformId: number): Promise<any> {
    // TODO: Implement product sync logic
    return { message: 'Product sync started', productId: id, platformId };
  }

  async getProductMappings(productId: number): Promise<ProductMapping[]> {
    return this.productMappingRepository.find({
      where: { product_id: productId },
      relations: ['platform'],
    });
  }

  async createProductMapping(
    productId: number,
    payload: { platform_id: number; platform_product_id?: string; platform_data?: any; sync_direction?: string },
  ): Promise<ProductMapping> {
    const mapping = this.productMappingRepository.create({
      product_id: productId,
      platform_id: payload.platform_id,
      platform_product_id: payload.platform_product_id,
      platform_data: payload.platform_data,
      sync_direction: payload.sync_direction ?? 'bidirectional',
      sync_status: 'pending',
    });
    return this.productMappingRepository.save(mapping);
  }

  async updateProductMapping(
    productId: number,
    mappingId: number,
    payload: Partial<{ platform_product_id: string; platform_data: any; sync_status: string; sync_direction: string }>,
  ): Promise<ProductMapping> {
    const mapping = await this.productMappingRepository.findOne({ where: { id: mappingId, product_id: productId } });
    if (!mapping) throw new Error('Product mapping not found');
    Object.assign(mapping, payload);
    return this.productMappingRepository.save(mapping);
  }

  async deleteProductMapping(productId: number, mappingId: number): Promise<void> {
    await this.productMappingRepository.delete({ id: mappingId, product_id: productId });
  }
}
