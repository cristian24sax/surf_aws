import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinalizeDynamicSubscriptions1792535600000 implements MigrationInterface {
  name = 'FinalizeDynamicSubscriptions1792535600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: Array<{ total: string }> = await queryRunner.query(
      'SELECT COUNT(*)::text AS total FROM subscriptions',
    );

    if (Number(result[0].total) > 0) {
      throw new Error(
        'No se puede finalizar la migración: existen suscripciones que requieren revisión',
      );
    }

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "school_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "plan_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      DROP COLUMN "plan"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."subscriptions_plan_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."subscriptions_plan_enum"
      AS ENUM ('BASIC', 'PREMIUM', 'PRO')
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ADD COLUMN "plan" "public"."subscriptions_plan_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "school_id" DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "plan_id" DROP NOT NULL
    `);
  }
}
