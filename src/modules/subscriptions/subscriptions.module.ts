import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import { SUBSCRIPTION_REPOSITORY } from './application/tokens';

import { SubscriptionOrmEntity } from './infrastructure/persistence/typeorm/subscription.orm-entity';
import { TypeOrmSubscriptionRepository } from './infrastructure/persistence/typeorm/typeorm-subscription.repository';
import { SubscriptionController } from './presentation/http/controllers/subscription.controller';
import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionOrmEntity]), SubscriptionPlansModule],

  controllers: [SubscriptionController],

  providers: [
    CreateSubscriptionUseCase,

    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: TypeOrmSubscriptionRepository,
    },
  ],

  exports: [CreateSubscriptionUseCase],
})
export class SubscriptionsModule {}
