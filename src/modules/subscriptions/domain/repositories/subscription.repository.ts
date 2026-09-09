import { Subscription } from '../entities/subscription.entity';

export interface SubscriptionRepository {
  save(subscription: Subscription): Promise<void>;

  findById(id: string): Promise<Subscription | null>;
}
