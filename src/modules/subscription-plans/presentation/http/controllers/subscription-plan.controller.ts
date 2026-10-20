import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateSubscriptionPlanDto } from '../../../application/dto/create-subscription-plan.dto';
import { ListSubscriptionPlansDto } from '../../../application/dto/list-subscription-plans.dto';
import { CreateSubscriptionPlanUseCase } from '../../../application/use-cases/create-subscription-plan.use-case';
import { ListSubscriptionPlansUseCase } from '../../../application/use-cases/list-subscription-plans.use-case';

@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly listSubscriptionPlansUseCase: ListSubscriptionPlansUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    return this.createSubscriptionPlanUseCase.execute(dto);
  }

  @Get()
  async findAll(@Query() query: ListSubscriptionPlansDto) {
    return this.listSubscriptionPlansUseCase.execute(query.schoolId);
  }
}
