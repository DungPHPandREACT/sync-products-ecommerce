import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../typeorm.config';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: (process.env.TYPEORM_SYNC ?? 'false') === 'true',
      migrationsRun: (process.env.TYPEORM_MIGRATIONS_RUN ?? 'false') === 'true',
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
