import { ClassType } from '../../../domain/entities/class-type.entity';
import { ClassTypeOrmEntity } from './class-type.orm-entity';

export class ClassTypeMapper {
  static toPersistence(domain: ClassType): ClassTypeOrmEntity {
    const entity = new ClassTypeOrmEntity();

    entity.id = domain.id;
    entity.schoolId = domain.schoolId;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }

  static toDomain(entity: ClassTypeOrmEntity): ClassType {
    return ClassType.create({
      id: entity.id,
      schoolId: entity.schoolId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
