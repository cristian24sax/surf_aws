import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { SubscriptionStatus } from '../../../domain/entities/subscription.entity';

@Entity('subscriptions')
@Index('IDX_subscriptions_school', ['schoolId'])
@Index('IDX_subscriptions_student', ['studentId'])
@Index('IDX_subscriptions_plan', ['planId'])
export class SubscriptionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    name: 'school_id',
    type: 'uuid',
  })
  schoolId: string;

  @Column({
    name: 'student_id',
    type: 'uuid',
  })
  studentId: string;

  @Column({
    name: 'plan_id',
    type: 'uuid',
  })
  planId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    enumName: 'subscriptions_status_enum',
  })
  status: SubscriptionStatus;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamptz',
    nullable: true,
  })
  endDate: Date | null;

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
