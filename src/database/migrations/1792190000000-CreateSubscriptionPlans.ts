import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionPlans1792190000000 implements MigrationInterface {
  name = 'CreateSubscriptionPlans1792190000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "subscription_plans" (
        "id" uuid NOT NULL,
        "school_id" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" text,
        "price" numeric(12,2) NOT NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'PEN',
        "duration_days" integer NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT "PK_subscription_plans"
          PRIMARY KEY ("id"),

        CONSTRAINT "CHK_subscription_plans_price"
          CHECK ("price" >= 0),

        CONSTRAINT "CHK_subscription_plans_duration"
          CHECK ("duration_days" > 0),

        CONSTRAINT "CHK_subscription_plans_currency"
          CHECK ("currency" ~ '^[A-Z]{3}$')
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscription_plans_school"
      ON "subscription_plans" ("school_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_subscription_plans_school"
    `);

    await queryRunner.query(`
      DROP TABLE "subscription_plans"
    `);
  }
}
