import { SubscriptionPlan } from '../entities/subscription-plan.entity';

export interface SubscriptionPlanRepository {
  save(plan: SubscriptionPlan): Promise<void>;

  findById(id: string): Promise<SubscriptionPlan | null>;

  findBySchoolId(schoolId: string): Promise<SubscriptionPlan[]>;

  findByIdAndSchoolId(id: string, schoolId: string): Promise<SubscriptionPlan | null>;
}
