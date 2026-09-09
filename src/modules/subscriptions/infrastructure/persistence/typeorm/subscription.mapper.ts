import { Subscription } from '../../../domain/entities/subscription.entity';

import { SubscriptionOrmEntity } from './subscription.orm-entity';

export class SubscriptionMapper {
  static toPersistence(domain: Subscription): SubscriptionOrmEntity {
    const entity = new SubscriptionOrmEntity();

    entity.id = domain.id;
    entity.studentId = domain.studentId;
    entity.plan = domain.plan;
    entity.status = domain.status;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;

    return entity;
  }

  static toDomain(entity: SubscriptionOrmEntity): Subscription {
    return Subscription.create({
      id: entity.id,
      studentId: entity.studentId,
      plan: entity.plan,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
    });
  }
}
