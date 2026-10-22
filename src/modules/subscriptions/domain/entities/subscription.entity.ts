export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export interface CreateSubscriptionProps {
  id: string;
  schoolId: string;
  studentId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscription {
  private constructor(
    public readonly id: string,
    public readonly schoolId: string,
    public readonly studentId: string,
    public readonly planId: string,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreateSubscriptionProps): Subscription {
    if (!props.id.trim()) {
      throw new Error('El identificador es obligatorio');
    }

    if (!props.schoolId.trim()) {
      throw new Error('La escuela es obligatoria');
    }

    if (!props.studentId.trim()) {
      throw new Error('El alumno es obligatorio');
    }

    if (!props.planId.trim()) {
      throw new Error('El plan es obligatorio');
    }

    if (!Object.values(SubscriptionStatus).includes(props.status)) {
      throw new Error('El estado de suscripción no es válido');
    }

    const dates = [
      props.startDate,
      props.createdAt,
      props.updatedAt,
      ...(props.endDate ? [props.endDate] : []),
    ];

    if (dates.some((date) => !(date instanceof Date) || !Number.isFinite(date.getTime()))) {
      throw new Error('Las fechas de suscripción son inválidas');
    }

    if (props.endDate && props.endDate.getTime() <= props.startDate.getTime()) {
      throw new Error('La fecha de vencimiento debe ser posterior al inicio');
    }

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new Error('La fecha de actualización no puede ser anterior a la creación');
    }

    return new Subscription(
      props.id,
      props.schoolId,
      props.studentId,
      props.planId,
      props.status,
      props.startDate,
      props.endDate,
      props.createdAt,
      props.updatedAt,
    );
  }
}
