import { IsInt, IsUUID, Min } from 'class-validator';

export class CreatePlanAllowanceDto {
  // Temporal: posteriormente vendrá del contexto autenticado.
  @IsUUID()
  schoolId: string;

  @IsUUID()
  planId: string;

  @IsUUID()
  classTypeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
