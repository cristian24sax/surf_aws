import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTypeOrmConfig } from './database/typeorm.config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    AuthModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
