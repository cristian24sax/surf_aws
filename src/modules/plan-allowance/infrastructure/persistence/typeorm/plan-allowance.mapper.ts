import { PlanAllowance } from '../../../domain/entities/plan-allowance.entity';
import { PlanAllowanceOrmEntity } from './plan-allowance.orm-entity';

export class PlanAllowanceMapper {
  static toPersistence(domain: PlanAllowance): PlanAllowanceOrmEntity {
    const entity = new PlanAllowanceOrmEntity();

    entity.id = domain.id;
    entity.schoolId = domain.schoolId;
    entity.planId = domain.planId;
    entity.classTypeId = domain.classTypeId;
    entity.quantity = domain.quantity;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }

  static toDomain(entity: PlanAllowanceOrmEntity): PlanAllowance {
    return PlanAllowance.create({
      id: entity.id,
      schoolId: entity.schoolId,
      planId: entity.planId,
      classTypeId: entity.classTypeId,
      quantity: entity.quantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
