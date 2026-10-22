import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreatePlanAllowanceDto } from '../../../application/dto/create-plan-allowance.dto';
import { ListPlanAllowancesDto } from '../../../application/dto/list-plan-allowances.dto';

import { CreatePlanAllowanceUseCase } from '../../../application/use-cases/create-plan-allowance.use-case';
import { ListPlanAllowancesUseCase } from '../../../application/use-cases/list-plan-allowances.use-case';

@Controller('plan-allowances')
export class PlanAllowanceController {
  constructor(
    private readonly createPlanAllowanceUseCase: CreatePlanAllowanceUseCase,
    private readonly listPlanAllowancesUseCase: ListPlanAllowancesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePlanAllowanceDto) {
    return this.createPlanAllowanceUseCase.execute(dto);
  }

  @Get()
  async findAll(@Query() query: ListPlanAllowancesDto) {
    return this.listPlanAllowancesUseCase.execute(query.planId, query.schoolId);
  }
}
