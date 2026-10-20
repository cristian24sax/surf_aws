import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository';

import { SubscriptionPlanMapper } from './subscription-plan.mapper';
import { SubscriptionPlanOrmEntity } from './subscription-plan.orm-entity';

@Injectable()
export class TypeOrmSubscriptionPlanRepository implements SubscriptionPlanRepository {
  constructor(
    @InjectRepository(SubscriptionPlanOrmEntity)
    private readonly repository: Repository<SubscriptionPlanOrmEntity>,
  ) {}

  async save(plan: SubscriptionPlan): Promise<void> {
    const entity = SubscriptionPlanMapper.toPersistence(plan);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? SubscriptionPlanMapper.toDomain(entity) : null;
  }

  async findBySchoolId(schoolId: string): Promise<SubscriptionPlan[]> {
    const entities = await this.repository.find({
      where: { schoolId },
      order: { createdAt: 'DESC' },
    });

    return entities.map(SubscriptionPlanMapper.toDomain);
  }

  async findByIdAndSchoolId(id: string, schoolId: string): Promise<SubscriptionPlan | null> {
    const entity = await this.repository.findOne({
      where: { id, schoolId },
    });

    return entity ? SubscriptionPlanMapper.toDomain(entity) : null;
  }
}
