import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class ReplaceProductToBatchColumn1735624075121
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("stock", "productId");
    await queryRunner.addColumn(
      "stock",
      new TableColumn({
        name: "batchId",
        type: "varchar",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "stock",
      new TableForeignKey({
        columnNames: ["batchId"],
        referencedColumnNames: ["id"],
        referencedTableName: "batch",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("stock", "batchId");
    await queryRunner.dropColumn("stock", "batchId");
    await queryRunner.addColumn(
      "stock",
      new TableColumn({
        name: "productId",
        type: "varchar",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "stock",
      new TableForeignKey({
        columnNames: ["productId"],
        referencedColumnNames: ["id"],
        referencedTableName: "product",
        onDelete: "CASCADE",
      })
    );
  }
}
