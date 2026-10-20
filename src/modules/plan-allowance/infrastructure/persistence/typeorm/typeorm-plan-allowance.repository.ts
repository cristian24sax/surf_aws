import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlanAllowance } from '../../../domain/entities/plan-allowance.entity';
import { PlanAllowanceRepository } from '../../../domain/repositories/plan-allowance.repository';

import { PlanAllowanceMapper } from './plan-allowance.mapper';
import { PlanAllowanceOrmEntity } from './plan-allowance.orm-entity';

@Injectable()
export class TypeOrmPlanAllowanceRepository implements PlanAllowanceRepository {
  constructor(
    @InjectRepository(PlanAllowanceOrmEntity)
    private readonly repository: Repository<PlanAllowanceOrmEntity>,
  ) {}

  async save(allowance: PlanAllowance): Promise<void> {
    const entity = PlanAllowanceMapper.toPersistence(allowance);

    await this.repository.save(entity);
  }

  async findByIdAndSchoolId(id: string, schoolId: string): Promise<PlanAllowance | null> {
    const entity = await this.repository.findOne({
      where: { id, schoolId },
    });

    return entity ? PlanAllowanceMapper.toDomain(entity) : null;
  }

  async findByPlanIdAndSchoolId(planId: string, schoolId: string): Promise<PlanAllowance[]> {
    const entities = await this.repository.find({
      where: { planId, schoolId },
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => PlanAllowanceMapper.toDomain(entity));
  }

  async findByPlanAndClassType(
    planId: string,
    classTypeId: string,
    schoolId: string,
  ): Promise<PlanAllowance | null> {
    const entity = await this.repository.findOne({
      where: {
        planId,
        classTypeId,
        schoolId,
      },
    });

    return entity ? PlanAllowanceMapper.toDomain(entity) : null;
  }
}
