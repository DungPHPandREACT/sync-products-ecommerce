import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync product to platform' })
  @ApiResponse({ status: 200, description: 'Product sync started' })
  syncProduct(@Param('id') id: string, @Body() syncData: { platformId: number }) {
    return this.productsService.syncProduct(+id, syncData.platformId);
  }

  @Get(':id/mappings')
  @ApiOperation({ summary: 'Get product mappings' })
  @ApiResponse({ status: 200, description: 'Product mappings retrieved successfully' })
  getProductMappings(@Param('id') id: string) {
    return this.productsService.getProductMappings(+id);
  }

  @Post(':id/mappings')
  @ApiOperation({ summary: 'Create product mapping' })
  @ApiResponse({ status: 201, description: 'Product mapping created successfully' })
  createProductMapping(
    @Param('id') id: string,
    @Body() payload: { platform_id: number; platform_product_id?: string; platform_data?: any; sync_direction?: string },
  ) {
    return this.productsService.createProductMapping(+id, payload);
  }

  @Patch(':id/mappings/:mappingId')
  @ApiOperation({ summary: 'Update product mapping' })
  @ApiResponse({ status: 200, description: 'Product mapping updated successfully' })
  updateProductMapping(
    @Param('id') id: string,
    @Param('mappingId') mappingId: string,
    @Body() payload: Partial<{ platform_product_id: string; platform_data: any; sync_status: string; sync_direction: string }>,
  ) {
    return this.productsService.updateProductMapping(+id, +mappingId, payload);
  }

  @Delete(':id/mappings/:mappingId')
  @ApiOperation({ summary: 'Delete product mapping' })
  @ApiResponse({ status: 200, description: 'Product mapping deleted successfully' })
  deleteProductMapping(@Param('id') id: string, @Param('mappingId') mappingId: string) {
    return this.productsService.deleteProductMapping(+id, +mappingId);
  }
}
