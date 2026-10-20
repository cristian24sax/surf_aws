import { Inject, Injectable } from '@nestjs/common';

import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository';
import { SUBSCRIPTION_PLAN_REPOSITORY } from '../tokens';

@Injectable()
export class ListSubscriptionPlansUseCase {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_REPOSITORY)
    private readonly repository: SubscriptionPlanRepository,
  ) {}

  async execute(schoolId: string): Promise<SubscriptionPlan[]> {
    return this.repository.findBySchoolId(schoolId);
  }
}
