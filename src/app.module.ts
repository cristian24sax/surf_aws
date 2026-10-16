import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTypeOrmConfig } from './database/typeorm.config';
import { HealthModule } from './health/health.module';
import { FilesModule } from './modules/files/files.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from './config/aws.config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsConfig],
      validationSchema: envValidationSchema,
    }),
    HealthModule,
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    FilesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
