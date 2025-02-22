import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class statusColumnCategoriesTable1733305697228
  implements MigrationInterface
{
  name = "statusColumnCategoriesTable1733305697228";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "categories",
      new TableColumn({
        name: "status",
        type: "boolean",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("categories", "status");
  }
}
