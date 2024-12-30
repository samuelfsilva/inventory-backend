import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class DepositIdColumn1735586371216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "stock",
      new TableColumn({
        name: "depositId",
        type: "varchar",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "stock",
      new TableForeignKey({
        columnNames: ["depositId"],
        referencedColumnNames: ["id"],
        referencedTableName: "deposit",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("stock", "depositId");
  }
}
