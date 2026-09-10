import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1788969622734 implements MigrationInterface {
  name = 'InitialSchema1788969622734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_plan_enum" AS ENUM('BASIC', 'PREMIUM', 'PRO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL, "student_id" uuid NOT NULL, "plan" "public"."subscriptions_plan_enum" NOT NULL, "status" "public"."subscriptions_status_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."subscriptions_plan_enum"`);
  }
}
