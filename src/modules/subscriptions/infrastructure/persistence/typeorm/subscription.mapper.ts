import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionOrmEntity } from './subscription.orm-entity';

export class SubscriptionMapper {
  static toPersistence(domain: Subscription): SubscriptionOrmEntity {
    const entity = new SubscriptionOrmEntity();

    entity.id = domain.id;
    entity.schoolId = domain.schoolId;
    entity.studentId = domain.studentId;
    entity.planId = domain.planId;
    entity.status = domain.status;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }

  static toDomain(entity: SubscriptionOrmEntity): Subscription {
    if (!entity.schoolId || !entity.planId) {
      throw new Error('La suscripción no tiene escuela o plan configurado');
    }

    return Subscription.create({
      id: entity.id,
      schoolId: entity.schoolId,
      studentId: entity.studentId,
      planId: entity.planId,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
