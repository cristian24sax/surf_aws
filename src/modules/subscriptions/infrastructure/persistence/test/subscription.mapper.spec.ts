import { Subscription, SubscriptionStatus } from '../../../domain/entities/subscription.entity';
import { SubscriptionMapper } from '../typeorm/subscription.mapper';
import { SubscriptionOrmEntity } from '../typeorm/subscription.orm-entity';

describe('SubscriptionMapper', () => {
  const subscription = Subscription.create({
    id: '11111111-1111-4111-8111-111111111111',
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    studentId: '550e8400-e29b-41d4-a716-446655440000',
    planId: '863c346d-9671-4c2d-b153-6fff3ec516f2',
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date('2026-10-22T10:00:00Z'),
    endDate: new Date('2026-11-21T10:00:00Z'),
    createdAt: new Date('2026-10-22T10:00:00Z'),
    updatedAt: new Date('2026-10-22T10:00:00Z'),
  });

  it('debe convertir dominio a persistencia', () => {
    const entity = SubscriptionMapper.toPersistence(subscription);

    expect(entity).toBeInstanceOf(SubscriptionOrmEntity);
    expect(entity.schoolId).toBe(subscription.schoolId);
    expect(entity.planId).toBe(subscription.planId);
    expect(entity.status).toBe(SubscriptionStatus.ACTIVE);
  });

  it('debe convertir persistencia a dominio', () => {
    const entity = SubscriptionMapper.toPersistence(subscription);

    const result = SubscriptionMapper.toDomain(entity);

    expect(result).toBeInstanceOf(Subscription);
    expect(result.studentId).toBe(subscription.studentId);
    expect(result.planId).toBe(subscription.planId);
    expect(result.endDate).toEqual(subscription.endDate);
  });

  it('debe rechazar una suscripción sin plan', () => {
    const entity = SubscriptionMapper.toPersistence(subscription);

    entity.planId = null;

    expect(() => SubscriptionMapper.toDomain(entity)).toThrow(
      'La suscripción no tiene escuela o plan configurado',
    );
  });

  it('debe rechazar una suscripción sin escuela', () => {
    const entity = SubscriptionMapper.toPersistence(subscription);

    entity.schoolId = null;

    expect(() => SubscriptionMapper.toDomain(entity)).toThrow(
      'La suscripción no tiene escuela o plan configurado',
    );
  });
});
