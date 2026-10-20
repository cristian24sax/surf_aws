export interface CreateClassTypeProps {
  id: string;
  schoolId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassType {
  private constructor(
    public readonly id: string,
    public readonly schoolId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: CreateClassTypeProps): ClassType {
    const name = props.name.trim();

    if (!name) {
      throw new Error('El nombre del tipo de clase es obligatorio');
    }

    if (name.length > 100) {
      throw new Error('El nombre del tipo de clase no puede superar 100 caracteres');
    }

    if (!props.schoolId.trim()) {
      throw new Error('La escuela es obligatoria');
    }

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new Error('La fecha de actualización no puede ser anterior a la creación');
    }

    return new ClassType(
      props.id,
      props.schoolId,
      name,
      props.description?.trim() || null,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }
}
