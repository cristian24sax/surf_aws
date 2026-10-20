import { PlanAllowance } from '../entities/plan-allowance.entity';

export interface PlanAllowanceRepository {
  save(allowance: PlanAllowance): Promise<void>;

  findByIdAndSchoolId(id: string, schoolId: string): Promise<PlanAllowance | null>;

  findByPlanIdAndSchoolId(planId: string, schoolId: string): Promise<PlanAllowance[]>;

  findByPlanAndClassType(
    planId: string,
    classTypeId: string,
    schoolId: string,
  ): Promise<PlanAllowance | null>;
}
