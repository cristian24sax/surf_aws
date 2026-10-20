import { Inject, Injectable } from '@nestjs/common';

import { ClassType } from '../../domain/entities/class-type.entity';
import { ClassTypeRepository } from '../../domain/repositories/class-type.repository';
import { CLASS_TYPE_REPOSITORY } from '../tokens';

@Injectable()
export class ListClassTypesUseCase {
  constructor(
    @Inject(CLASS_TYPE_REPOSITORY)
    private readonly repository: ClassTypeRepository,
  ) {}

  async execute(schoolId: string): Promise<ClassType[]> {
    return this.repository.findBySchoolId(schoolId);
  }
}
