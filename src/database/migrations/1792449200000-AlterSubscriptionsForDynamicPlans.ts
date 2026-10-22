import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSubscriptionsForDynamicPlans1792449200000 implements MigrationInterface {
  name = 'AlterSubscriptionsForDynamicPlans1792449200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ADD COLUMN "school_id" uuid,
      ADD COLUMN "plan_id" uuid,
      ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now(),
      ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT now()
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ADD CONSTRAINT "FK_subscriptions_plan_school"
      FOREIGN KEY ("plan_id", "school_id")
      REFERENCES "subscription_plans" ("id", "school_id")
      ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscriptions_school"
      ON "subscriptions" ("school_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscriptions_student"
      ON "subscriptions" ("student_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscriptions_plan"
      ON "subscriptions" ("plan_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_subscriptions_plan"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_subscriptions_student"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_subscriptions_school"
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      DROP CONSTRAINT "FK_subscriptions_plan_school"
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      DROP COLUMN "updated_at",
      DROP COLUMN "created_at",
      DROP COLUMN "plan_id",
      DROP COLUMN "school_id"
    `);
  }
}
