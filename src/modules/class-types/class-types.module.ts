import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CLASS_TYPE_REPOSITORY } from './application/tokens';

import { CreateClassTypeUseCase } from './application/use-cases/create-class-type.use-case';
import { ListClassTypesUseCase } from './application/use-cases/list-class-types.use-case';

import { ClassTypeOrmEntity } from './infrastructure/persistence/typeorm/class-type.orm-entity';
import { TypeOrmClassTypeRepository } from './infrastructure/persistence/typeorm/typeorm-class-type.repository';

import { ClassTypeController } from './presentation/http/controllers/class-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClassTypeOrmEntity])],
  controllers: [ClassTypeController],
  providers: [
    CreateClassTypeUseCase,
    ListClassTypesUseCase,
    {
      provide: CLASS_TYPE_REPOSITORY,
      useClass: TypeOrmClassTypeRepository,
    },
  ],
})
export class ClassTypesModule {}
