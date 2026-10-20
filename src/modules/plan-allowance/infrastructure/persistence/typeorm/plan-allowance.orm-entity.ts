import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plan_allowances')
@Unique('UQ_plan_allowances_plan_class', ['planId', 'classTypeId'])
@Index('IDX_plan_allowances_school', ['schoolId'])
@Index('IDX_plan_allowances_class_type', ['classTypeId'])
export class PlanAllowanceOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  @Column({ name: 'class_type_id', type: 'uuid' })
  classTypeId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
