import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionAllowances1792622000000 implements MigrationInterface {
  name = 'CreateSubscriptionAllowances1792622000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Necesario para referenciar una suscripción
    // junto con su escuela.
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ADD CONSTRAINT "UQ_subscriptions_id_school"
      UNIQUE ("id", "school_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "subscription_allowances" (
        "id" uuid NOT NULL,
        "school_id" uuid NOT NULL,
        "subscription_id" uuid NOT NULL,
        "class_type_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT "PK_subscription_allowances"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_subscription_allowances_subscription_class"
          UNIQUE ("subscription_id", "class_type_id"),

        CONSTRAINT "CHK_subscription_allowances_quantity"
          CHECK ("quantity" > 0),

        CONSTRAINT "FK_subscription_allowances_subscription_school"
          FOREIGN KEY ("subscription_id", "school_id")
          REFERENCES "subscriptions" ("id", "school_id")
          ON DELETE RESTRICT,

        CONSTRAINT "FK_subscription_allowances_class_school"
          FOREIGN KEY ("class_type_id", "school_id")
          REFERENCES "class_types" ("id", "school_id")
          ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscription_allowances_school"
      ON "subscription_allowances" ("school_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscription_allowances_class_type"
      ON "subscription_allowances" ("class_type_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "subscription_allowances"
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      DROP CONSTRAINT "UQ_subscriptions_id_school"
    `);
  }
}
