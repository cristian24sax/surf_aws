import { IsUUID } from 'class-validator';

export class ListPlanAllowancesDto {
  @IsUUID()
  schoolId: string;

  @IsUUID()
  planId: string;
}
