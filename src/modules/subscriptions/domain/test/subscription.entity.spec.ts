import {
  CreateSubscriptionProps,
  Subscription,
  SubscriptionStatus,
} from '../entities/subscription.entity';

describe('Subscription', () => {
  const validProps: CreateSubscriptionProps = {
    id: '11111111-1111-4111-8111-111111111111',
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    studentId: '550e8400-e29b-41d4-a716-446655440000',
    planId: '863c346d-9671-4c2d-b153-6fff3ec516f2',
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date('2026-10-22T10:00:00Z'),
    endDate: new Date('2026-11-21T10:00:00Z'),
    createdAt: new Date('2026-10-22T10:00:00Z'),
    updatedAt: new Date('2026-10-22T10:00:00Z'),
  };

  it('debe crear una suscripción válida', () => {
    const subscription = Subscription.create(validProps);

    expect(subscription.schoolId).toBe(validProps.schoolId);
    expect(subscription.studentId).toBe(validProps.studentId);
    expect(subscription.planId).toBe(validProps.planId);
    expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
  });

  it('debe rechazar una escuela vacía', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        schoolId: '',
      }),
    ).toThrow('La escuela es obligatoria');
  });

  it('debe rechazar un alumno vacío', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        studentId: '',
      }),
    ).toThrow('El alumno es obligatorio');
  });

  it('debe rechazar un plan vacío', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        planId: '',
      }),
    ).toThrow('El plan es obligatorio');
  });

  it('debe rechazar un estado inválido', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        status: 'UNKNOWN' as SubscriptionStatus,
      }),
    ).toThrow('El estado de suscripción no es válido');
  });

  it('debe rechazar un vencimiento anterior al inicio', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        endDate: new Date('2026-10-21T10:00:00Z'),
      }),
    ).toThrow('La fecha de vencimiento debe ser posterior al inicio');
  });

  it('debe rechazar fechas inválidas', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        startDate: new Date('invalid'),
      }),
    ).toThrow('Las fechas de suscripción son inválidas');
  });

  it('debe permitir una fecha de vencimiento nula', () => {
    const subscription = Subscription.create({
      ...validProps,
      endDate: null,
    });

    expect(subscription.endDate).toBeNull();
  });

  it('debe rechazar una actualización anterior a la creación', () => {
    expect(() =>
      Subscription.create({
        ...validProps,
        updatedAt: new Date('2026-10-21T10:00:00Z'),
      }),
    ).toThrow('La fecha de actualización no puede ser anterior a la creación');
  });
});
