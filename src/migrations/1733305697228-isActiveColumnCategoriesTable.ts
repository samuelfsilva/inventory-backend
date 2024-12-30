import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class IsActiveColumnCategoriesTable1733305697228
  implements MigrationInterface
{
  name = "IsActiveColumnCategoriesTable1733305697228";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "categories",
      new TableColumn({
        name: "isActive",
        type: "boolean",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("categories", "isActive");
  }
}
