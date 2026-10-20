import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateSubscriptionPlanDto {
  // Temporal para pruebas locales.
  // Posteriormente vendrá del contexto autenticado.
  @IsUUID()
  schoolId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  price: number;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @IsInt()
  @Min(1)
  durationDays: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
