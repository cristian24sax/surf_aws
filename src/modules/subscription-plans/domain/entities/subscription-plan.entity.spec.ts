import { SubscriptionPlan, CreateSubscriptionPlanProps } from './subscription-plan.entity';

describe('SubscriptionPlan', () => {
  const validProps: CreateSubscriptionPlanProps = {
    id: 'b56dd9cc-90a6-4b65-a6ae-f5cc0340e871',
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    name: 'Premium',
    description: 'Plan mensual',
    price: 220,
    currency: 'PEN',
    durationDays: 30,
    isActive: true,
    createdAt: new Date('2026-10-17'),
    updatedAt: new Date('2026-10-17'),
  };

  it('debe crear un plan válido', () => {
    const plan = SubscriptionPlan.create(validProps);

    expect(plan.name).toBe('Premium');
    expect(plan.price).toBe(220);
    expect(plan.durationDays).toBe(30);
    expect(plan.isActive).toBe(true);
  });

  it('debe rechazar un nombre vacío', () => {
    expect(() =>
      SubscriptionPlan.create({
        ...validProps,
        name: '  ',
      }),
    ).toThrow('El nombre del plan es obligatorio');
  });

  it('debe rechazar un precio negativo', () => {
    expect(() =>
      SubscriptionPlan.create({
        ...validProps,
        price: -10,
      }),
    ).toThrow('El precio debe ser un número no negativo');
  });

  it('debe rechazar una duración inválida', () => {
    expect(() =>
      SubscriptionPlan.create({
        ...validProps,
        durationDays: 0,
      }),
    ).toThrow('La duración debe ser un entero positivo');
  });

  it('debe rechazar una moneda inválida', () => {
    expect(() =>
      SubscriptionPlan.create({
        ...validProps,
        currency: 'soles',
      }),
    ).toThrow('La moneda debe tener tres letras mayúsculas');
  });
});
