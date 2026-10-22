// import { ListSubscriptionPlansUseCase } from './list-subscription-plans.use-case';
import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository';
import { ListSubscriptionPlansUseCase } from '../use-cases/list-subscription-plans.use-case';

describe('ListSubscriptionPlansUseCase', () => {
  let useCase: ListSubscriptionPlansUseCase;
  let repository: jest.Mocked<SubscriptionPlanRepository>;

  const schoolId = '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7';
  const createPlan = (id: string, name: string) =>
    SubscriptionPlan.create({
      id,
      schoolId,
      name,
      description: null,
      price: 150,
      currency: 'PEN',
      durationDays: 30,
      isActive: true,
      createdAt: new Date('2026-10-17'),
      updatedAt: new Date('2026-10-17'),
    });

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySchoolId: jest.fn(),
      findByIdAndSchoolId: jest.fn(),
    };

    useCase = new ListSubscriptionPlansUseCase(repository);
  });

  it('debe listar los planes de una escuela', async () => {
    const plans = [
      createPlan('11111111-1111-4111-8111-111111111111', 'Básico'),
      createPlan('22222222-2222-4222-8222-222222222222', 'Premium'),
    ];

    repository.findBySchoolId.mockResolvedValue(plans);

    const result = await useCase.execute(schoolId);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Básico');
    expect(result[1].name).toBe('Premium');

    expect(repository.findBySchoolId).toHaveBeenCalledWith(schoolId);
  });

  it('debe retornar un arreglo vacío cuando no hay planes', async () => {
    repository.findBySchoolId.mockResolvedValue([]);

    const result = await useCase.execute(schoolId);

    expect(result).toEqual([]);
  });

  it('debe propagar errores del repositorio', async () => {
    repository.findBySchoolId.mockRejectedValue(new Error('Database unavailable'));

    await expect(useCase.execute(schoolId)).rejects.toThrow('Database unavailable');
  });
});
