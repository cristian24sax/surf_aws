import { IsEnum, IsUUID } from 'class-validator';

import { SubscriptionPlan } from '../../domain/entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsUUID()
  studentId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}
