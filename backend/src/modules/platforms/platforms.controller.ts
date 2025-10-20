import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlatformsService } from './platforms.service';
import { PlatformSyncService } from './platform-sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Platforms')
@Controller('platforms')
@UseGuards(JwtAuthGuard)
export class PlatformsController {
  constructor(
    private readonly platformsService: PlatformsService,
    private readonly platformSyncService: PlatformSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all platforms' })
  @ApiResponse({ status: 200, description: 'Platforms retrieved successfully' })
  findAll() {
    return this.platformsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get platform by id' })
  @ApiResponse({ status: 200, description: 'Platform retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.platformsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create platform' })
  @ApiResponse({ status: 201, description: 'Platform created successfully' })
  create(@Body() createPlatformDto: any) {
    return this.platformsService.create(createPlatformDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update platform' })
  @ApiResponse({ status: 200, description: 'Platform updated successfully' })
  update(@Param('id') id: string, @Body() updatePlatformDto: any) {
    return this.platformsService.update(+id, updatePlatformDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete platform' })
  @ApiResponse({ status: 200, description: 'Platform deleted successfully' })
  remove(@Param('id') id: string) {
    return this.platformsService.remove(+id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  @ApiResponse({ status: 200, description: 'Platform statistics retrieved successfully' })
  getStats() {
    return this.platformsService.getStats();
  }

  @Post(':id/test-connection')
  @ApiOperation({ summary: 'Test platform connection' })
  @ApiResponse({ status: 200, description: 'Connection test completed' })
  testConnection(@Param('id') id: string) {
    return this.platformsService.testConnection(+id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync platform' })
  @ApiResponse({ status: 200, description: 'Platform sync started' })
  syncPlatform(@Param('id') id: string) {
    return this.platformSyncService.syncPlatform(+id);
  }
}
