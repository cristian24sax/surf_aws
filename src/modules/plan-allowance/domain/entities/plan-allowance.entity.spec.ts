import { CreatePlanAllowanceProps, PlanAllowance } from './plan-allowance.entity';

describe('PlanAllowance', () => {
  const validProps: CreatePlanAllowanceProps = {
    id: '11111111-1111-4111-8111-111111111111',
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    planId: '863c346d-9671-4c2d-b153-6fff3ec516f2',
    classTypeId: '22222222-2222-4222-8222-222222222222',
    quantity: 6,
    createdAt: new Date('2026-10-17'),
    updatedAt: new Date('2026-10-17'),
  };

  it('debe crear un beneficio válido', () => {
    const allowance = PlanAllowance.create(validProps);

    expect(allowance.planId).toBe(validProps.planId);
    expect(allowance.classTypeId).toBe(validProps.classTypeId);
    expect(allowance.quantity).toBe(6);
  });

  it('debe rechazar cantidades negativas', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        quantity: -1,
      }),
    ).toThrow('La cantidad de clases debe ser un entero positivo');
  });

  it('debe rechazar una cantidad igual a cero', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        quantity: 0,
      }),
    ).toThrow('La cantidad de clases debe ser un entero positivo');
  });

  it('debe rechazar cantidades decimales', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        quantity: 2.5,
      }),
    ).toThrow('La cantidad de clases debe ser un entero positivo');
  });

  it('debe rechazar una escuela vacía', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        schoolId: '',
      }),
    ).toThrow('La escuela es obligatoria');
  });

  it('debe rechazar un plan vacío', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        planId: '',
      }),
    ).toThrow('El plan es obligatorio');
  });

  it('debe rechazar un tipo de clase vacío', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        classTypeId: '',
      }),
    ).toThrow('El tipo de clase es obligatorio');
  });

  it('debe rechazar fechas inconsistentes', () => {
    expect(() =>
      PlanAllowance.create({
        ...validProps,
        updatedAt: new Date('2026-10-16'),
      }),
    ).toThrow('Las fechas del beneficio son inválidas');
  });
});
