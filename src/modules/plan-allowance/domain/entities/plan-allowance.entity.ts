export interface CreatePlanAllowanceProps {
  id: string;
  schoolId: string;
  planId: string;
  classTypeId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PlanAllowance {
  private constructor(
    public readonly id: string,
    public readonly schoolId: string,
    public readonly planId: string,
    public readonly classTypeId: string,
    public readonly quantity: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreatePlanAllowanceProps): PlanAllowance {
    if (!props.schoolId.trim()) {
      throw new Error('La escuela es obligatoria');
    }

    if (!props.planId.trim()) {
      throw new Error('El plan es obligatorio');
    }

    if (!props.classTypeId.trim()) {
      throw new Error('El tipo de clase es obligatorio');
    }

    if (!Number.isSafeInteger(props.quantity) || props.quantity <= 0) {
      throw new Error('La cantidad de clases debe ser un entero positivo');
    }

    if (
      !Number.isFinite(props.createdAt.getTime()) ||
      !Number.isFinite(props.updatedAt.getTime()) ||
      props.updatedAt.getTime() < props.createdAt.getTime()
    ) {
      throw new Error('Las fechas del beneficio son inválidas');
    }

    return new PlanAllowance(
      props.id,
      props.schoolId,
      props.planId,
      props.classTypeId,
      props.quantity,
      props.createdAt,
      props.updatedAt,
    );
  }
}
