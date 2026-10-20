import { IsUUID } from 'class-validator';

export class ListSubscriptionPlansDto {
  @IsUUID()
  schoolId: string;
}
