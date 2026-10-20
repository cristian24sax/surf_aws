import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SUBSCRIPTION_PLAN_REPOSITORY } from './application/tokens';
import { CreateSubscriptionPlanUseCase } from './application/use-cases/create-subscription-plan.use-case';

import { SubscriptionPlanOrmEntity } from './infrastructure/persistence/typeorm/subscription-plan.orm-entity';
import { TypeOrmSubscriptionPlanRepository } from './infrastructure/persistence/typeorm/typeorm-subscription-plan.repository';

import { SubscriptionPlanController } from './presentation/http/controllers/subscription-plan.controller';
import { ListSubscriptionPlansUseCase } from './application/use-cases/list-subscription-plans.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlanOrmEntity])],
  controllers: [SubscriptionPlanController],
  providers: [
    CreateSubscriptionPlanUseCase,
    ListSubscriptionPlansUseCase,
    {
      provide: SUBSCRIPTION_PLAN_REPOSITORY,
      useClass: TypeOrmSubscriptionPlanRepository,
    },
  ],
})
export class SubscriptionPlansModule {}
