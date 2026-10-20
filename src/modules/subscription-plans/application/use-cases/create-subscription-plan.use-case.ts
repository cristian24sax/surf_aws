import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { SUBSCRIPTION_PLAN_REPOSITORY } from '../tokens';

@Injectable()
export class CreateSubscriptionPlanUseCase {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_REPOSITORY)
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(dto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    const now = new Date();

    const plan = SubscriptionPlan.create({
      id: randomUUID(),
      schoolId: dto.schoolId,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      currency: dto.currency ?? 'PEN',
      durationDays: dto.durationDays,
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    await this.subscriptionPlanRepository.save(plan);

    return plan;
  }
}
