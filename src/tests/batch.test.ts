import { describe, it, expect, afterEach } from 'vitest';
import { Batch } from '../entities/batch';
import { AppDataSource } from '../database/data-source';

describe('Batch Entity', () => {
  afterEach(async () => {
    await AppDataSource.getRepository(Batch).clear();
  });

  it('should create a new batch', async () => {
    const batch = new Batch();
    batch.description = 'Test Batch';
    batch.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const saved = await AppDataSource.manager.save(batch);

    expect(saved).toHaveProperty('id');
    expect(saved.description).toBe('Test Batch');
    expect(saved.expirationDate).toBeInstanceOf(Date);
  });
  it('should update a batch', async () => {
    const batch = new Batch();
    batch.description = 'Test Batch';
    batch.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const saved = await AppDataSource.manager.save(batch);

    await AppDataSource
    .manager
    .update(
      Batch, 
      { id: saved.id }, 
      { 
        description: 'Test Update Batch',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })

    const select = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: saved.id })
    .getOne()
    
    expect(select?.description).toBe('Test Update Batch');
    expect(select?.expirationDate).toBeInstanceOf(Date);
  });
  it('should delete a group', async () => {
    const batch = new Batch();
    batch.description = 'Test Delete Batch';
    batch.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const saved = await AppDataSource.manager.save(batch);
    const savedId = saved.id;

    await AppDataSource
    .manager
    .delete(
      Batch, 
      { id: savedId })

    const salect = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: savedId })
    .getOne()
    
    expect(salect).toBeNull();
  });
});

