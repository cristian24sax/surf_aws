import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../domain/entities/subscription.entity';

import { InMemorySubscriptionRepository } from '../test/fakes/in-memory-subscription.repository';

import { CreateSubscriptionUseCase } from './create-subscription.use-case';

describe('CreateSubscriptionUseCase', () => {
  it('should create an active subscription', async () => {
    const repository = new InMemorySubscriptionRepository();
    const useCase = new CreateSubscriptionUseCase(repository);

    const result = await useCase.execute({
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      plan: SubscriptionPlan.PREMIUM,
    });

    expect(result.studentId).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(result.plan).toBe(SubscriptionPlan.PREMIUM);
    expect(result.status).toBe(SubscriptionStatus.ACTIVE);
    expect(repository.items).toHaveLength(1);
  });
  it('should persist the subscription', async () => {
    const repository = new InMemorySubscriptionRepository();

    const useCase = new CreateSubscriptionUseCase(repository);

    await useCase.execute({
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      plan: SubscriptionPlan.BASIC,
    });

    expect(repository.items).toHaveLength(1);

    expect(repository.items[0].plan).toBe(SubscriptionPlan.BASIC);
  });
});
