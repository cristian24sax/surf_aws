import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Subscription, SubscriptionStatus } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

import { SubscriptionPlanRepository } from '../../../subscription-plans/domain/repositories/subscription-plan.repository';
import { SUBSCRIPTION_PLAN_REPOSITORY } from '../../../subscription-plans/application/tokens';

import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SUBSCRIPTION_REPOSITORY } from '../tokens';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,

    @Inject(SUBSCRIPTION_PLAN_REPOSITORY)
    private readonly planRepository: SubscriptionPlanRepository,
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    const plan = await this.planRepository.findByIdAndSchoolId(dto.planId, dto.schoolId);

    if (!plan) {
      throw new NotFoundException('El plan no existe en esta escuela');
    }

    if (!plan.isActive) {
      throw new BadRequestException('No se puede contratar un plan inactivo');
    }

    const now = new Date();

    const endDate = new Date(now);

    endDate.setUTCDate(endDate.getUTCDate() + plan.durationDays);

    const subscription = Subscription.create({
      id: randomUUID(),
      schoolId: dto.schoolId,
      studentId: dto.studentId,
      planId: dto.planId,
      status: SubscriptionStatus.INACTIVE,
      startDate: now,
      endDate,
      createdAt: now,
      updatedAt: now,
    });

    await this.subscriptionRepository.save(subscription);

    return subscription;
  }
}
