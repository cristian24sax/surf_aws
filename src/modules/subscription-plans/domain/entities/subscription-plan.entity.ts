export interface CreateSubscriptionPlanProps {
  id: string;
  schoolId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionPlan {
  private constructor(
    public readonly id: string,
    public readonly schoolId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly currency: string,
    public readonly durationDays: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreateSubscriptionPlanProps): SubscriptionPlan {
    if (!props.schoolId.trim()) {
      throw new Error('La escuela es obligatoria');
    }

    if (!props.name.trim()) {
      throw new Error('El nombre del plan es obligatorio');
    }

    if (!Number.isFinite(props.price) || props.price < 0) {
      throw new Error('El precio debe ser un número no negativo');
    }

    if (!Number.isSafeInteger(props.durationDays) || props.durationDays <= 0) {
      throw new Error('La duración debe ser un entero positivo');
    }

    if (!/^[A-Z]{3}$/.test(props.currency)) {
      throw new Error('La moneda debe tener tres letras mayúsculas');
    }

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new Error('La fecha de actualización no puede ser anterior a la creación');
    }

    return new SubscriptionPlan(
      props.id,
      props.schoolId,
      props.name.trim(),
      props.description,
      props.price,
      props.currency,
      props.durationDays,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }
}
