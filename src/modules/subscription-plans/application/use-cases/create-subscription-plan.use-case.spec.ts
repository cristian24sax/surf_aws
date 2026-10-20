import { CreateSubscriptionPlanUseCase } from './create-subscription-plan.use-case';
import { SubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository';
import { SubscriptionPlan } from '../../domain/entities/subscription-plan.entity';

describe('CreateSubscriptionPlanUseCase', () => {
  let useCase: CreateSubscriptionPlanUseCase;
  let repository: jest.Mocked<SubscriptionPlanRepository>;

  const dto = {
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    name: 'Premium',
    description: 'Plan mensual',
    price: 220,
    currency: 'PEN',
    durationDays: 30,
    isActive: true,
  };

  beforeEach(() => {
    repository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findBySchoolId: jest.fn(),
    };

    useCase = new CreateSubscriptionPlanUseCase(repository);
  });

  it('debe crear y guardar un plan', async () => {
    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(SubscriptionPlan);
    expect(result.name).toBe('Premium');
    expect(result.price).toBe(220);
    expect(result.schoolId).toBe(dto.schoolId);
    expect(result.id).toBeDefined();

    expect(repository.save).toHaveBeenCalledWith(result);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('debe aplicar valores por defecto', async () => {
    const result = await useCase.execute({
      schoolId: dto.schoolId,
      name: 'Básico',
      price: 120,
      durationDays: 30,
    });

    expect(result.currency).toBe('PEN');
    expect(result.isActive).toBe(true);
    expect(result.description).toBeNull();
  });

  it('no debe guardar un plan inválido', async () => {
    await expect(
      useCase.execute({
        ...dto,
        price: -10,
      }),
    ).rejects.toThrow();

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('debe propagar errores de persistencia', async () => {
    repository.save.mockRejectedValue(new Error('Database unavailable'));

    await expect(useCase.execute(dto)).rejects.toThrow('Database unavailable');
  });
});
