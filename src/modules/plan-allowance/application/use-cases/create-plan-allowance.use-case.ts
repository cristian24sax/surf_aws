import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { SubscriptionPlanRepository } from '../../../subscription-plans/domain/repositories/subscription-plan.repository';
import { SUBSCRIPTION_PLAN_REPOSITORY } from '../../../subscription-plans/application/tokens';

import { ClassTypeRepository } from '../../../class-types/domain/repositories/class-type.repository';
import { CLASS_TYPE_REPOSITORY } from '../../../class-types/application/tokens';

import { PlanAllowance } from '../../domain/entities/plan-allowance.entity';
import { PlanAllowanceRepository } from '../../domain/repositories/plan-allowance.repository';

import { CreatePlanAllowanceDto } from '../dto/create-plan-allowance.dto';
import { PLAN_ALLOWANCE_REPOSITORY } from '../tokens';

@Injectable()
export class CreatePlanAllowanceUseCase {
  constructor(
    @Inject(PLAN_ALLOWANCE_REPOSITORY)
    private readonly allowanceRepository: PlanAllowanceRepository,

    @Inject(SUBSCRIPTION_PLAN_REPOSITORY)
    private readonly planRepository: SubscriptionPlanRepository,

    @Inject(CLASS_TYPE_REPOSITORY)
    private readonly classTypeRepository: ClassTypeRepository,
  ) {}

  async execute(dto: CreatePlanAllowanceDto): Promise<PlanAllowance> {
    const plan = await this.planRepository.findByIdAndSchoolId(dto.planId, dto.schoolId);

    if (!plan) {
      throw new NotFoundException('El plan no existe en esta escuela');
    }

    if (!plan.isActive) {
      throw new BadRequestException('No se pueden configurar beneficios en un plan inactivo');
    }

    const classType = await this.classTypeRepository.findByIdAndSchoolId(
      dto.classTypeId,
      dto.schoolId,
    );

    if (!classType) {
      throw new NotFoundException('El tipo de clase no existe en esta escuela');
    }

    if (!classType.isActive) {
      throw new BadRequestException('No se pueden asignar tipos de clases inactivos');
    }

    const existing = await this.allowanceRepository.findByPlanAndClassType(
      dto.planId,
      dto.classTypeId,
      dto.schoolId,
    );

    if (existing) {
      throw new ConflictException('Este tipo de clase ya está configurado en el plan');
    }

    const now = new Date();

    const allowance = PlanAllowance.create({
      id: randomUUID(),
      schoolId: dto.schoolId,
      planId: dto.planId,
      classTypeId: dto.classTypeId,
      quantity: dto.quantity,
      createdAt: now,
      updatedAt: now,
    });

    await this.allowanceRepository.save(allowance);

    return allowance;
  }
}
