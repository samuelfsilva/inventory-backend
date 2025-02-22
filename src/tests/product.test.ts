import { afterEach, describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { AppDataSource } from "../server";

describe("Product Entity", () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Product).clear();
  });

  it("should create a new product", async () => {
    const product = new Product();
    product.name = "Test Product";
    product.description = "Test Product";
    product.status = true;

    const saved = await AppDataSource.manager.save(product);

    expect(saved).toHaveProperty("id");
    expect(saved.name).toBe("Test Product");
    expect(saved.description).toBe("Test Product");
  });
  it("should update a product", async () => {
    const product = new Product();
    product.name = "Test Product";
    product.description = "Test Product";
    product.status = true;

    const saved = await AppDataSource.manager.save(product);

    await AppDataSource.manager.update(
      Product,
      { id: saved.id },
      { name: "Test Update Product", description: "Test Update Product" }
    );

    const select = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :id", { id: saved.id })
      .getOne();

    expect(select?.description).toBe("Test Update Product");
  });
  it("should delete a product", async () => {
    const product = new Product();
    product.name = "Test Delete Product";
    product.description = "Test Delete Product";
    product.status = true;

    const saved = await AppDataSource.manager.save(product);
    const savedId = saved.id;

    await AppDataSource.manager.delete(Product, { id: savedId });

    const salect = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :id", { id: savedId })
      .getOne();

    expect(salect).toBeNull();
  });
});
