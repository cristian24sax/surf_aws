import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';

export class InMemorySubscriptionRepository implements SubscriptionRepository {
  private readonly subscriptions: Subscription[] = [];

  async save(subscription: Subscription): Promise<void> {
    this.subscriptions.push(subscription);
  }

  async findById(id: string): Promise<Subscription | null> {
    return (
      this.subscriptions.find((subscription) => subscription.id === id) ?? null
    );
  }

  get items(): Subscription[] {
    return this.subscriptions;
  }
}
