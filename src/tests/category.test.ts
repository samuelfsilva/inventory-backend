import { afterEach, describe, expect, it } from "vitest";
import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/category";

describe("Category Entity", () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Category).clear();
  });

  it("should create a new category", async () => {
    const category = new Category();
    category.description = "Test Category";

    const saved = await AppDataSource.manager.save(category);

    expect(saved).toHaveProperty("id");
    expect(saved.description).toBe("Test Category");
  });
  it("should update a category", async () => {
    const category = new Category();
    category.description = "Test Category";

    const saved = await AppDataSource.manager.save(category);

    await AppDataSource.manager.update(
      Category,
      { id: saved.id },
      { description: "Test Update Category" }
    );

    const select = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id: saved.id })
      .getOne();

    expect(select?.description).toBe("Test Update Category");
  });
  it("should delete a category", async () => {
    const category = new Category();
    category.description = "Test Delete Category";

    const saved = await AppDataSource.manager.save(category);
    const savedId = saved.id;

    await AppDataSource.manager.delete(Category, { id: savedId });

    const salect = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id: savedId })
      .getOne();

    expect(salect).toBeNull();
  });
});
