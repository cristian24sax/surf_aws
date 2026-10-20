import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassTypes1792276400000 implements MigrationInterface {
  name = 'CreateClassTypes1792276400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "class_types" (
        "id" uuid NOT NULL,
        "school_id" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT "PK_class_types"
          PRIMARY KEY ("id"),

        CONSTRAINT "CHK_class_types_name"
          CHECK (length(btrim("name")) > 0)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_class_types_school"
      ON "class_types" ("school_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_class_types_school_name"
      ON "class_types" ("school_id", lower(btrim("name")))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "class_types"
    `);
  }
}
