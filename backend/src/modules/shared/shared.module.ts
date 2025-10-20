import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from '../platforms/entities/platform.entity';
import { PlatformAdapterFactory } from '../sync/adapters/platform-adapter.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Platform]),
  ],
  providers: [PlatformAdapterFactory],
  exports: [PlatformAdapterFactory],
})
export class SharedModule {}
