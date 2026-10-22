import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionPlansModule } from '../subscription-plans/subscription-plans.module';
import { ClassTypesModule } from '../class-types/class-types.module';

import { PLAN_ALLOWANCE_REPOSITORY } from './application/tokens';

import { CreatePlanAllowanceUseCase } from './application/use-cases/create-plan-allowance.use-case';
import { ListPlanAllowancesUseCase } from './application/use-cases/list-plan-allowances.use-case';

import { PlanAllowanceOrmEntity } from './infrastructure/persistence/typeorm/plan-allowance.orm-entity';
import { TypeOrmPlanAllowanceRepository } from './infrastructure/persistence/typeorm/typeorm-plan-allowance.repository';

import { PlanAllowanceController } from './presentation/http/controllers/plan-allowance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanAllowanceOrmEntity]),
    SubscriptionPlansModule,
    ClassTypesModule,
  ],
  controllers: [PlanAllowanceController],
  providers: [
    CreatePlanAllowanceUseCase,
    ListPlanAllowancesUseCase,
    {
      provide: PLAN_ALLOWANCE_REPOSITORY,
      useClass: TypeOrmPlanAllowanceRepository,
    },
  ],
})
export class PlanAllowancesModule {}
