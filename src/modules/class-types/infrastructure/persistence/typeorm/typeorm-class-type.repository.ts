import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClassType } from '../../../domain/entities/class-type.entity';
import { ClassTypeRepository } from '../../../domain/repositories/class-type.repository';

import { ClassTypeMapper } from './class-type.mapper';
import { ClassTypeOrmEntity } from './class-type.orm-entity';

@Injectable()
export class TypeOrmClassTypeRepository implements ClassTypeRepository {
  constructor(
    @InjectRepository(ClassTypeOrmEntity)
    private readonly repository: Repository<ClassTypeOrmEntity>,
  ) {}

  async save(classType: ClassType): Promise<void> {
    const entity = ClassTypeMapper.toPersistence(classType);

    await this.repository.save(entity);
  }

  async findByIdAndSchoolId(id: string, schoolId: string): Promise<ClassType | null> {
    const entity = await this.repository.findOne({
      where: { id, schoolId },
    });

    return entity ? ClassTypeMapper.toDomain(entity) : null;
  }

  async findBySchoolId(schoolId: string): Promise<ClassType[]> {
    const entities = await this.repository.find({
      where: { schoolId },
      order: { name: 'ASC' },
    });

    return entities.map((entity) => ClassTypeMapper.toDomain(entity));
  }

  async findByNameAndSchoolId(name: string, schoolId: string): Promise<ClassType | null> {
    const entity = await this.repository
      .createQueryBuilder('classType')
      .where('classType.schoolId = :schoolId', { schoolId })
      .andWhere('lower(btrim(classType.name)) = lower(btrim(:name))', {
        name,
      })
      .getOne();

    return entity ? ClassTypeMapper.toDomain(entity) : null;
  }
}
