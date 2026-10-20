import { IsUUID } from 'class-validator';

export class ListClassTypesDto {
  @IsUUID()
  schoolId: string;
}
