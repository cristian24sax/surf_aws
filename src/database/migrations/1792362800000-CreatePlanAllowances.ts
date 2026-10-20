import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanAllowances1792362800000 implements MigrationInterface {
  name = 'CreatePlanAllowances1792362800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "subscription_plans"
      ADD CONSTRAINT "UQ_subscription_plans_id_school"
      UNIQUE ("id", "school_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "class_types"
      ADD CONSTRAINT "UQ_class_types_id_school"
      UNIQUE ("id", "school_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "plan_allowances" (
        "id" uuid NOT NULL,
        "school_id" uuid NOT NULL,
        "plan_id" uuid NOT NULL,
        "class_type_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT "PK_plan_allowances"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_plan_allowances_plan_class"
          UNIQUE ("plan_id", "class_type_id"),

        CONSTRAINT "CHK_plan_allowances_quantity"
          CHECK ("quantity" > 0),

        CONSTRAINT "FK_plan_allowances_plan_school"
          FOREIGN KEY ("plan_id", "school_id")
          REFERENCES "subscription_plans" ("id", "school_id")
          ON DELETE RESTRICT,

        CONSTRAINT "FK_plan_allowances_class_school"
          FOREIGN KEY ("class_type_id", "school_id")
          REFERENCES "class_types" ("id", "school_id")
          ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plan_allowances_school"
      ON "plan_allowances" ("school_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plan_allowances_class_type"
      ON "plan_allowances" ("class_type_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "plan_allowances"
    `);

    await queryRunner.query(`
      ALTER TABLE "class_types"
      DROP CONSTRAINT "UQ_class_types_id_school"
    `);

    await queryRunner.query(`
      ALTER TABLE "subscription_plans"
      DROP CONSTRAINT "UQ_subscription_plans_id_school"
    `);
  }
}
