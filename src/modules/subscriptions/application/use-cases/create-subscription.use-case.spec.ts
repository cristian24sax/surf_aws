import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SubscriptionStatus } from '../../domain/entities/subscription.entity';

import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { SubscriptionPlanRepository } from '../../../subscription-plans/domain/repositories/subscription-plan.repository';
import { SubscriptionPlan } from '../../../subscription-plans/domain/entities/subscription-plan.entity';

import { CreateSubscriptionUseCase } from './create-subscription.use-case';

describe('CreateSubscriptionUseCase', () => {
  let useCase: CreateSubscriptionUseCase;

  let subscriptionRepository: jest.Mocked<SubscriptionRepository>;
  let planRepository: jest.Mocked<SubscriptionPlanRepository>;

  const dto = {
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    studentId: '550e8400-e29b-41d4-a716-446655440000',
    planId: '863c346d-9671-4c2d-b153-6fff3ec516f2',
  };

  const createPlan = (isActive = true) => {
    const now = new Date();

    return SubscriptionPlan.create({
      id: dto.planId,
      schoolId: dto.schoolId,
      name: 'Premium',
      description: null,
      price: 220,
      currency: 'PEN',
      durationDays: 30,
      isActive,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    subscriptionRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
    };

    planRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByIdAndSchoolId: jest.fn().mockResolvedValue(createPlan()),
      findBySchoolId: jest.fn(),
    };

    useCase = new CreateSubscriptionUseCase(subscriptionRepository, planRepository);
  });

  it('debe crear una suscripción con plan dinámico', async () => {
    const result = await useCase.execute(dto);

    expect(result.schoolId).toBe(dto.schoolId);
    expect(result.studentId).toBe(dto.studentId);
    expect(result.planId).toBe(dto.planId);
    expect(result.status).toBe(SubscriptionStatus.INACTIVE);

    expect(subscriptionRepository.save).toHaveBeenCalledWith(result);
  });

  it('debe calcular el vencimiento según la duración del plan', async () => {
    const result = await useCase.execute(dto);

    const expectedEndDate = new Date(result.startDate);

    expectedEndDate.setUTCDate(expectedEndDate.getUTCDate() + 30);

    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('debe rechazar un plan inexistente', async () => {
    planRepository.findByIdAndSchoolId.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);

    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('debe rechazar un plan inactivo', async () => {
    planRepository.findByIdAndSchoolId.mockResolvedValue(createPlan(false));

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);

    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('debe propagar errores de persistencia', async () => {
    subscriptionRepository.save.mockRejectedValue(new Error('Database unavailable'));

    await expect(useCase.execute(dto)).rejects.toThrow('Database unavailable');
  });
});
