import { MigrationInterface, QueryRunner } from "typeorm";

export class IsActiveColumnCategoriesTable1733305697228 implements MigrationInterface {
    name = 'IsActiveColumnCategoriesTable1733305697228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "isActive" boolean NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "description") SELECT "id", "description" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "description") SELECT "id", "description" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
    }

}
