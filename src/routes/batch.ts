import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Batch } from '../entities/batch';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const batchSchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  expirationDate: Joi.date().min('now').required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Create a new batch'
  */
  const { error, value } = batchSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { description, expirationDate } = value;

  const batch = new Batch();
  batch.description = description;
  batch.expirationDate = expirationDate;

  await AppDataSource.manager.save(batch);

  res.status(201).json(batch);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Get all batches'
  */
  const batchs = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .getMany();

  res.status(200).json(batchs);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Get a batch by id'
  */
  const batch = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: req.params.id })
    .getOne();

  res.status(200).json(batch);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Update a batch by id'
  */
  const batchs = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: req.params.id })
    .getOne();

  if (!batchs) return res.status(400).json({
    error: {
      id: 'Batch not found'
    }
  });

  const { error, value } = batchSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { description, expirationDate } = value;

  await AppDataSource.manager.update(
    Batch,
    { id: batchs.id },
    {
      description,
      expirationDate
    }
  );

  res.status(200).json(batchs);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Delete a batch by id'
  */
  const batchs = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: req.params.id })
    .getOne();

  if (!batchs) return res.status(400).json({
    error: {
      id: 'Batch not found'
    }
  });

  await AppDataSource.manager.delete(
    Batch,
    { id: batchs.id }
  );

  res.status(204).send();
});

export default router;

