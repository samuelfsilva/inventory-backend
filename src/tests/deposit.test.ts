import { afterEach, describe, expect, it } from "vitest";
import { Deposit } from "../entities/deposit";
import { AppDataSource } from "../server";

describe("Deposit Entity", () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Deposit).clear();
  });

  it("should create a new deposit", async () => {
    const deposit = new Deposit();
    deposit.name = "Test Deposit";
    deposit.description = "Test Deposit";
    deposit.status = true;

    const saved = await AppDataSource.manager.save(deposit);

    expect(saved).toHaveProperty("id");
    expect(saved.name).toBe("Test Deposit");
    expect(saved.description).toBe("Test Deposit");
  });

  it("should update a deposit", async () => {
    const deposit = new Deposit();
    deposit.name = "Test Deposit";
    deposit.description = "Test Deposit";
    deposit.status = true;

    const saved = await AppDataSource.manager.save(deposit);

    await AppDataSource.manager.update(
      Deposit,
      { id: saved.id },
      { name: "Test Update Deposit", description: "Test Update Deposit" }
    );

    const select = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("deposit.id = :id", { id: saved.id })
      .getOne();

    expect(select?.name).toBe("Test Update Deposit");
    expect(select?.description).toBe("Test Update Deposit");
  });

  it("should delete a deposit", async () => {
    const deposit = new Deposit();
    deposit.name = "Test Delete Deposit";
    deposit.description = "Test Delete Deposit";
    deposit.status = true;

    const saved = await AppDataSource.manager.save(deposit);
    const savedId = saved.id;

    await AppDataSource.manager.delete(Deposit, { id: savedId });

    const salect = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("deposit.id = :id", { id: savedId })
      .getOne();

    expect(salect).toBeNull();
  });
});
