import { ConflictException } from '@nestjs/common';

import { ClassType } from '../../domain/entities/class-type.entity';
import { ClassTypeRepository } from '../../domain/repositories/class-type.repository';
import { CreateClassTypeUseCase } from '../use-cases/create-class-type.use-case';

describe('CreateClassTypeUseCase', () => {
  let useCase: CreateClassTypeUseCase;
  let repository: jest.Mocked<ClassTypeRepository>;

  const dto = {
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    name: 'Surf',
    description: 'Clases de surf',
    isActive: true,
  };

  beforeEach(() => {
    repository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndSchoolId: jest.fn(),
      findBySchoolId: jest.fn(),
      findByNameAndSchoolId: jest.fn().mockResolvedValue(null),
    };

    useCase = new CreateClassTypeUseCase(repository);
  });

  it('debe crear un tipo de clase válido', async () => {
    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(ClassType);
    expect(result.name).toBe('Surf');
    expect(result.schoolId).toBe(dto.schoolId);
    expect(result.isActive).toBe(true);

    expect(repository.save).toHaveBeenCalledWith(result);
  });

  it('debe rechazar un nombre duplicado', async () => {
    const existingClassType = ClassType.create({
      id: '11111111-1111-4111-8111-111111111111',
      schoolId: dto.schoolId,
      name: 'Surf',
      description: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findByNameAndSchoolId.mockResolvedValue(existingClassType);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('debe buscar duplicados dentro de la escuela', async () => {
    await useCase.execute({
      ...dto,
      name: '  Paddle  ',
    });

    expect(repository.findByNameAndSchoolId).toHaveBeenCalledWith('Paddle', dto.schoolId);
  });

  it('debe aplicar valores por defecto', async () => {
    const result = await useCase.execute({
      schoolId: dto.schoolId,
      name: 'Natación',
    });

    expect(result.isActive).toBe(true);
    expect(result.description).toBeNull();
  });

  it('debe propagar errores de persistencia', async () => {
    repository.save.mockRejectedValue(new Error('Database unavailable'));

    await expect(useCase.execute(dto)).rejects.toThrow('Database unavailable');
  });
});
