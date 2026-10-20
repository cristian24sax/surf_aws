import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateClassTypeDto } from '../../../application/dto/create-class-type.dto';
import { ListClassTypesDto } from '../../../application/dto/list-class-types.dto';

import { CreateClassTypeUseCase } from '../../../application/use-cases/create-class-type.use-case';
import { ListClassTypesUseCase } from '../../../application/use-cases/list-class-types.use-case';

@Controller('class-types')
export class ClassTypeController {
  constructor(
    private readonly createClassTypeUseCase: CreateClassTypeUseCase,
    private readonly listClassTypesUseCase: ListClassTypesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateClassTypeDto) {
    return this.createClassTypeUseCase.execute(dto);
  }

  @Get()
  async findAll(@Query() query: ListClassTypesDto) {
    return this.listClassTypesUseCase.execute(query.schoolId);
  }
}
