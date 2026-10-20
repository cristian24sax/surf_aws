import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanOrmEntity } from './subscription-plan.orm-entity';

export class SubscriptionPlanMapper {
  static toPersistence(domain: SubscriptionPlan): SubscriptionPlanOrmEntity {
    const entity = new SubscriptionPlanOrmEntity();

    entity.id = domain.id;
    entity.schoolId = domain.schoolId;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price.toFixed(2);
    entity.currency = domain.currency;
    entity.durationDays = domain.durationDays;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }

  static toDomain(entity: SubscriptionPlanOrmEntity): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: entity.id,
      schoolId: entity.schoolId,
      name: entity.name,
      description: entity.description,
      price: Number(entity.price),
      currency: entity.currency,
      durationDays: entity.durationDays,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
