import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTypeOrmConfig } from './database/typeorm.config';
import { HealthModule } from './health/health.module';
import { FilesModule } from './modules/files/files.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from './config/aws.config';
import { envValidationSchema } from './config/env.validation';
import { CacheModule } from './infrastructure/cache/cache.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { ClassTypesModule } from './modules/class-types/class-types.module';
import { PlanAllowancesModule } from './modules/plan-allowance/plan-allowance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsConfig],
      validationSchema: envValidationSchema,
    }),
    CacheModule,
    HealthModule,
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    FilesModule,
    SubscriptionsModule,
    SubscriptionPlansModule,
    ClassTypesModule,
    PlanAllowancesModule,
  ],
})
export class AppModule {}
