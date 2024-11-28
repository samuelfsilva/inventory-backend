import { describe, it, expect, afterEach } from 'vitest';
import { Stock } from '../entities/stock';
import { AppDataSource } from '../database/data-source';
import { Product } from '../entities/product';

describe('Stock Entity', () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Stock).clear();
    await AppDataSource.getRepository(Product).clear();
  });

  it('should create a new stock', async () => {
    const product = new Product();
    product.name = 'Test Product';
    product.description = 'Test Product';
    product.isActive = true;

    const stock = new Stock();
    stock.product = product;
    stock.quantity = 10;

    await AppDataSource.manager.save(product);
    const saved = await AppDataSource.manager.save(stock);

    expect(saved).toHaveProperty('id');
    expect(saved.quantity).toBe(10);
    expect(saved.product).toHaveProperty('id');
  });

  it('should update a stock', async () => {
    const product = new Product();
    product.name = 'Test Product';
    product.description = 'Test Product';
    product.isActive = true;

    const stock = new Stock();
    stock.product = product;
    stock.quantity = 10;

    await AppDataSource.manager.save(product);
    const saved = await AppDataSource.manager.save(stock);

    await AppDataSource
      .manager
      .update(
        Stock,
        { id: saved.id },
        { quantity: 20 }
      );

    const select = await AppDataSource
      .getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.id = :id", { id: saved.id })
      .getOne();

    expect(select?.quantity).toBe(20);
  });

  it('should delete a stock', async () => {
    const product = new Product();
    product.name = 'Test Product';
    product.description = 'Test Product';
    product.isActive = true;

    const stock = new Stock();
    stock.product = product;
    stock.quantity = 10;

    await AppDataSource.manager.save(product);
    const saved = await AppDataSource.manager.save(stock);
    const savedId = saved.id;

    await AppDataSource
      .manager
      .delete(
        Stock,
        { id: savedId }
      );

    const select = await AppDataSource
      .getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.id = :id", { id: savedId })
      .getOne();

    expect(select).toBeNull();
  });
});

