import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameProductColumns1735666604255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("product", "category_id", "categoryId");
    await queryRunner.renameColumn("product", "group_id", "groupId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("product", "categoryId", "category_id");
    await queryRunner.renameColumn("product", "groupId", "group_id");
  }
}
