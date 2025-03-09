import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceCategoriesToCategoryTable1735665790403
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("categories", "category");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("category", "categories");
  }
}
