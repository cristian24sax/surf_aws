import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from 'src/modules/subscriptions/application/dto/create-subscription.dto';

// import { CreateSubscriptionUseCase } from '../../application/use-cases/create-subscription.use-case';
// import { CreateSubscriptionDto } from '../../application/dto/create-subscription.dto';
import { CreateSubscriptionUseCase } from 'src/modules/subscriptions/application/use-cases/create-subscription.use-case';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriptionDto) {
    return this.createSubscriptionUseCase.execute(dto);
  }
}
