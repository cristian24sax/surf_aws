import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

import { PlanAllowanceRepository } from '../../domain/repositories/plan-allowance.repository';
import { SubscriptionPlanRepository } from '../../../subscription-plans/domain/repositories/subscription-plan.repository';
import { ClassTypeRepository } from '../../../class-types/domain/repositories/class-type.repository';

import { SubscriptionPlan } from '../../../subscription-plans/domain/entities/subscription-plan.entity';
import { ClassType } from '../../../class-types/domain/entities/class-type.entity';
import { CreatePlanAllowanceUseCase } from '../use-cases/create-plan-allowance.use-case';
import { QueryFailedError } from 'typeorm';
describe('CreatePlanAllowanceUseCase', () => {
  let useCase: CreatePlanAllowanceUseCase;

  let allowanceRepository: jest.Mocked<PlanAllowanceRepository>;
  let planRepository: jest.Mocked<SubscriptionPlanRepository>;
  let classTypeRepository: jest.Mocked<ClassTypeRepository>;

  const dto = {
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    planId: '863c346d-9671-4c2d-b153-6fff3ec516f2',
    classTypeId: '22222222-2222-4222-8222-222222222222',
    quantity: 6,
  };

  const createPlan = (isActive = true) =>
    SubscriptionPlan.create({
      id: dto.planId,
      schoolId: dto.schoolId,
      name: 'Premium',
      description: null,
      price: 220,
      currency: 'PEN',
      durationDays: 30,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createClassType = (isActive = true) =>
    ClassType.create({
      id: dto.classTypeId,
      schoolId: dto.schoolId,
      name: 'Surf',
      description: null,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  beforeEach(() => {
    allowanceRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByIdAndSchoolId: jest.fn(),
      findByPlanIdAndSchoolId: jest.fn(),
      findByPlanAndClassType: jest.fn().mockResolvedValue(null),
    };

    planRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByIdAndSchoolId: jest.fn().mockResolvedValue(createPlan()),
      findBySchoolId: jest.fn(),
    };

    classTypeRepository = {
      save: jest.fn(),
      findByIdAndSchoolId: jest.fn().mockResolvedValue(createClassType()),
      findBySchoolId: jest.fn(),
      findByNameAndSchoolId: jest.fn(),
    };

    useCase = new CreatePlanAllowanceUseCase(
      allowanceRepository,
      planRepository,
      classTypeRepository,
    );
  });

  it('debe devolver conflicto si PostgreSQL detecta un duplicado', async () => {
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505',
      constraint: 'UQ_plan_allowances_plan_class',
    });
    const databaseError = new QueryFailedError('INSERT INTO plan_allowances ...', [], driverError);

    allowanceRepository.save.mockRejectedValue(databaseError);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
  });

  it('debe crear un beneficio válido', async () => {
    const result = await useCase.execute(dto);

    expect(result.quantity).toBe(6);
    expect(result.planId).toBe(dto.planId);
    expect(result.classTypeId).toBe(dto.classTypeId);

    expect(allowanceRepository.save).toHaveBeenCalledWith(result);
  });

  it('debe rechazar un plan inexistente', async () => {
    planRepository.findByIdAndSchoolId.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);

    expect(allowanceRepository.save).not.toHaveBeenCalled();
  });

  it('debe rechazar un plan inactivo', async () => {
    planRepository.findByIdAndSchoolId.mockResolvedValue(createPlan(false));

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar un tipo de clase inexistente', async () => {
    classTypeRepository.findByIdAndSchoolId.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
  });

  it('debe rechazar un tipo de clase inactivo', async () => {
    classTypeRepository.findByIdAndSchoolId.mockResolvedValue(createClassType(false));

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar una asignación duplicada', async () => {
    allowanceRepository.findByPlanAndClassType.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      schoolId: dto.schoolId,
      planId: dto.planId,
      classTypeId: dto.classTypeId,
      quantity: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);

    expect(allowanceRepository.save).not.toHaveBeenCalled();
  });

  it('debe propagar errores de persistencia', async () => {
    allowanceRepository.save.mockRejectedValue(new Error('Database unavailable'));

    await expect(useCase.execute(dto)).rejects.toThrow('Database unavailable');
  });
});
