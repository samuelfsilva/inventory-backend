import { afterEach, describe, expect, it } from "vitest";
import { Movement } from "../entities/movement";
import { MovementItem as Item } from "../entities/movement_item";
import { Product } from "../entities/product";
import { AppDataSource } from "../server";

describe("Item Entity", () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Item).clear();
    await AppDataSource.getRepository(Movement).clear();
    await AppDataSource.getRepository(Product).clear();
  });

  it("should create a new item", async () => {
    const movement = new Movement();
    movement.movementDate = new Date();
    movement.status = true;

    const product = new Product();
    product.name = "Test Product";
    product.description = "Test Product";
    product.status = true;

    const item = new Item();
    item.movement = movement;
    item.product = product;
    item.price = 10.99;
    item.quantity = 1;
    item.details = "This is a test item";

    movement.items = [item];

    await AppDataSource.manager.save(product);
    await AppDataSource.manager.save(movement);
    const saved = await AppDataSource.manager.save(item);

    expect(saved).toHaveProperty("id");
    expect(saved.quantity).toBe(1);
  });
  it("should update a item", async () => {
    const movement = new Movement();
    movement.movementDate = new Date();
    movement.status = true;

    const product = new Product();
    product.name = "Test Product";
    product.description = "Test Product";
    product.status = true;

    const product2 = new Product();
    product2.name = "Test Product 2";
    product2.description = "Test Product 2";
    product2.status = true;

    const item = new Item();
    item.product = product;
    item.price = 10.99;
    item.quantity = 1;
    item.details = "This is a test item";
    product2.status = true;

    const item2 = new Item();
    item2.product = product2;
    item2.price = 15.99;
    item2.quantity = 10;
    item2.details = "This is a test item";

    movement.items = [item, item2];

    await AppDataSource.manager.save(product);
    await AppDataSource.manager.save(product2);
    await AppDataSource.manager.save(movement);
    const saved = await AppDataSource.manager.save(item);
    await AppDataSource.manager.save(item2);

    await AppDataSource.manager.update(
      Item,
      { id: saved.id },
      { details: "This is a test item update" }
    );

    const select = await AppDataSource.getRepository(Item)
      .createQueryBuilder("item")
      .where("item.id = :id", { id: saved.id })
      .getOne();

    expect(select?.details).toBe("This is a test item update");
  });
  it("should delete a item", async () => {
    const movement = new Movement();
    movement.movementDate = new Date();
    movement.status = true;

    const item = new Item();
    item.price = 10.99;
    item.quantity = 1;
    item.details = "This is a test item delete";

    movement.items = [item];

    const saved = await AppDataSource.manager.save(item);
    const savedId = saved.id;

    await AppDataSource.manager.delete(Item, { id: savedId });

    await AppDataSource.manager.delete(Movement, { id: movement.id });

    const salect = await AppDataSource.getRepository(Item)
      .createQueryBuilder("item")
      .where("item.id = :id", { id: savedId })
      .getOne();

    expect(salect).toBeNull();
  });
});
