import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionPlanRepository } from '../../../subscription-plans/domain/repositories/subscription-plan.repository';
import { SUBSCRIPTION_PLAN_REPOSITORY } from '../../../subscription-plans/application/tokens';

import { PlanAllowance } from '../../domain/entities/plan-allowance.entity';
import { PlanAllowanceRepository } from '../../domain/repositories/plan-allowance.repository';
import { PLAN_ALLOWANCE_REPOSITORY } from '../tokens';

@Injectable()
export class ListPlanAllowancesUseCase {
  constructor(
    @Inject(PLAN_ALLOWANCE_REPOSITORY)
    private readonly allowanceRepository: PlanAllowanceRepository,

    @Inject(SUBSCRIPTION_PLAN_REPOSITORY)
    private readonly planRepository: SubscriptionPlanRepository,
  ) {}

  async execute(planId: string, schoolId: string): Promise<PlanAllowance[]> {
    const plan = await this.planRepository.findByIdAndSchoolId(planId, schoolId);

    if (!plan) {
      throw new NotFoundException('El plan no existe en esta escuela');
    }

    return this.allowanceRepository.findByPlanIdAndSchoolId(planId, schoolId);
  }
}
