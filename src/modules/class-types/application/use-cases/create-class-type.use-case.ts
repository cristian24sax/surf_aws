import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ClassType } from '../../domain/entities/class-type.entity';
import { ClassTypeRepository } from '../../domain/repositories/class-type.repository';
import { CreateClassTypeDto } from '../dto/create-class-type.dto';
import { CLASS_TYPE_REPOSITORY } from '../tokens';

@Injectable()
export class CreateClassTypeUseCase {
  constructor(
    @Inject(CLASS_TYPE_REPOSITORY)
    private readonly classTypeRepository: ClassTypeRepository,
  ) {}

  async execute(dto: CreateClassTypeDto): Promise<ClassType> {
    const name = dto.name.trim();

    const existingClassType = await this.classTypeRepository.findByNameAndSchoolId(
      name,
      dto.schoolId,
    );

    if (existingClassType) {
      throw new ConflictException(`El tipo de clase "${name}" ya existe en esta escuela`);
    }

    const now = new Date();

    const classType = ClassType.create({
      id: randomUUID(),
      schoolId: dto.schoolId,
      name,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    await this.classTypeRepository.save(classType);

    return classType;
  }
}
