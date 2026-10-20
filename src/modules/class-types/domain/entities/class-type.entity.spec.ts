import { ClassType, CreateClassTypeProps } from './class-type.entity';

describe('ClassType', () => {
  const validProps: CreateClassTypeProps = {
    id: '11111111-1111-4111-8111-111111111111',
    schoolId: '9f26f365-0544-4b8a-b4d3-1fba6a1c9ef7',
    name: 'Surf',
    description: 'Clases de surf',
    isActive: true,
    createdAt: new Date('2026-10-17'),
    updatedAt: new Date('2026-10-17'),
  };

  it('debe crear un tipo de clase válido', () => {
    const classType = ClassType.create(validProps);

    expect(classType.name).toBe('Surf');
    expect(classType.schoolId).toBe(validProps.schoolId);
    expect(classType.isActive).toBe(true);
  });

  it('debe eliminar espacios al inicio y final del nombre', () => {
    const classType = ClassType.create({
      ...validProps,
      name: '  Paddle  ',
    });

    expect(classType.name).toBe('Paddle');
  });

  it('debe rechazar nombres vacíos', () => {
    expect(() =>
      ClassType.create({
        ...validProps,
        name: '   ',
      }),
    ).toThrow('El nombre del tipo de clase es obligatorio');
  });

  it('debe rechazar nombres mayores a 100 caracteres', () => {
    expect(() =>
      ClassType.create({
        ...validProps,
        name: 'A'.repeat(101),
      }),
    ).toThrow('El nombre del tipo de clase no puede superar 100 caracteres');
  });

  it('debe rechazar una escuela vacía', () => {
    expect(() =>
      ClassType.create({
        ...validProps,
        schoolId: '',
      }),
    ).toThrow('La escuela es obligatoria');
  });

  it('debe permitir un tipo de clase inactivo', () => {
    const classType = ClassType.create({
      ...validProps,
      isActive: false,
    });

    expect(classType.isActive).toBe(false);
  });

  it('debe rechazar fechas inconsistentes', () => {
    expect(() =>
      ClassType.create({
        ...validProps,
        updatedAt: new Date('2026-10-16'),
      }),
    ).toThrow('La fecha de actualización no puede ser anterior a la creación');
  });
});
