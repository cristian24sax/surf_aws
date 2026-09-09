import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';

import { SubscriptionMapper } from './subscription.mapper';
import { SubscriptionOrmEntity } from './subscription.orm-entity';

@Injectable()
export class TypeOrmSubscriptionRepository implements SubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionOrmEntity)
    private readonly repository: Repository<SubscriptionOrmEntity>,
  ) {}

  async save(subscription: Subscription): Promise<void> {
    const entity = SubscriptionMapper.toPersistence(subscription);

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Subscription | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return SubscriptionMapper.toDomain(entity);
  }
}
