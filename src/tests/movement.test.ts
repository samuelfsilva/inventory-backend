import { describe, it, expect, afterEach } from 'vitest';
import { Movement } from '../entities/movement';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/user';

describe('Movement Entity', () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Movement).clear();
    await AppDataSource.getRepository(User).clear();
  });

  it('should create a new movement', async () => {
    const user = new User();
    user.email = 'test@example.com';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.isActive = true;
    await AppDataSource.manager.save(user);

    const movement = new Movement();
    movement.movementDate = new Date();
    movement.isActive = true;
    movement.user = user;

    const saved = await AppDataSource.manager.save(movement);

    expect(saved).toHaveProperty('id');
    expect(saved.movementDate).toBeInstanceOf(Date);
    expect(saved.isActive).toBe(true);
    expect(saved.user).toHaveProperty('id');
  });

  it('should update a movement', async () => {
    const user = new User();
    user.email = 'test@example.com';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.isActive = true;
    await AppDataSource.manager.save(user);

    const movement = new Movement();
    movement.isActive = true;
    movement.movementDate = new Date();
    movement.user = user;

    const saved = await AppDataSource.manager.save(movement);
    const date = new Date();

    await AppDataSource.manager.update(
      Movement,
      { id: saved.id },
      { movementDate: date }
    );

    const select = await AppDataSource
      .getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :id", { id: saved.id })
      .getOne();

    expect(select?.movementDate).toBeInstanceOf(Date);
    expect(select?.isActive).toBe(true);
  });

  it('should delete a movement', async () => {
    const user = new User();
    user.email = 'test@example.com';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.isActive = true;
    await AppDataSource.manager.save(user);

    const movement = new Movement();
    movement.movementDate = new Date();
    movement.isActive = true;
    movement.user = user;

    const saved = await AppDataSource.manager.save(movement);
    const savedId = saved.id;

    await AppDataSource.manager.delete(Movement, { id: savedId });

    const movementct = await AppDataSource
      .getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :id", { id: savedId })
      .getOne();

    expect(movementct).toBeNull();
  });
});

