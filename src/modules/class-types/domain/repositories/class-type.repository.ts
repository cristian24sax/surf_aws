import { ClassType } from '../entities/class-type.entity';

export interface ClassTypeRepository {
  save(classType: ClassType): Promise<void>;

  findByIdAndSchoolId(id: string, schoolId: string): Promise<ClassType | null>;

  findBySchoolId(schoolId: string): Promise<ClassType[]>;

  findByNameAndSchoolId(name: string, schoolId: string): Promise<ClassType | null>;
}
