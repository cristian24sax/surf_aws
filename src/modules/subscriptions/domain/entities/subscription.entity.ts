export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  PRO = 'PRO',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export interface CreateSubscriptionProps {
  id: string;
  studentId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
}

export class Subscription {
  private constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly plan: SubscriptionPlan,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
  ) {}

  static create(props: CreateSubscriptionProps): Subscription {
    return new Subscription(
      props.id,
      props.studentId,
      props.plan,
      props.status,
      props.startDate,
      props.endDate,
    );
  }
}
