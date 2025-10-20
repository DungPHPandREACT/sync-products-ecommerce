import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncEngine } from './sync-engine.service';
import { SyncConfig } from './interfaces/sync.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sync')
@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly syncEngine: SyncEngine,
  ) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get all sync logs' })
  @ApiResponse({ status: 200, description: 'Sync logs retrieved successfully' })
  findAllLogs() {
    return this.syncService.findAllLogs();
  }

  @Get('conflicts')
  @ApiOperation({ summary: 'Get all sync conflicts' })
  @ApiResponse({ status: 200, description: 'Sync conflicts retrieved successfully' })
  findAllConflicts() {
    return this.syncService.findAllConflicts();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get sync statistics' })
  @ApiResponse({ status: 200, description: 'Sync statistics retrieved successfully' })
  getStats() {
    return this.syncService.getStats();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get sync status' })
  @ApiResponse({ status: 200, description: 'Sync status retrieved successfully' })
  getSyncStatus() {
    return this.syncService.getSyncStatus();
  }

  @Post('start')
  @ApiOperation({ summary: 'Start manual sync' })
  @ApiResponse({ status: 200, description: 'Sync started successfully' })
  async startSync(@Body() syncData: SyncConfig) {
    const job = await this.syncEngine.startSync(syncData);
    return { job };
  }

  @Post('stop')
  @ApiOperation({ summary: 'Stop sync' })
  @ApiResponse({ status: 200, description: 'Sync stopped successfully' })
  stopSync() {
    return this.syncService.stopSync();
  }

  @Patch('conflicts/:id/resolve')
  @ApiOperation({ summary: 'Resolve sync conflict' })
  @ApiResponse({ status: 200, description: 'Conflict resolved successfully' })
  resolveConflict(
    @Param('id') id: string,
    @Body() resolutionData: { resolution: string; resolvedBy: number },
  ) {
    return this.syncService.resolveConflict(+id, resolutionData.resolution, resolutionData.resolvedBy);
  }
}
