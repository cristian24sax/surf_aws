import { randomUUID } from 'node:crypto';

import {
  Subscription,
  SubscriptionStatus,
} from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SUBSCRIPTION_REPOSITORY } from '../tokens';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = Subscription.create({
      id: randomUUID(),
      studentId: dto.studentId,
      plan: dto.plan,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: null,
    });

    await this.subscriptionRepository.save(subscription);

    return subscription;
  }
}
