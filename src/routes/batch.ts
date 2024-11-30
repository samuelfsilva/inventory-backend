import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Batch } from '../entities/batch';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const batchSchema = Joi.object({
  description: Joi.string().required(),
  expirationDate: Joi.date().required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Create a new batch'
  */
  const { error } = batchSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { description, expirationDate } = req.body;

  if (!description || !expirationDate) {
    return res.status(400).send('Description and expiration date are required');
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (!(expirationDate instanceof Date) || isNaN(expirationDate.getTime())) {
    return res.status(400).send('Expiration date must be a valid date');
  }

  const batch = new Batch();
  batch.description = description.trim();
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

  res.send(batchs);
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

  res.status(201).json(batch);
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

  if (!batchs) return res.status(400).send('Batch not found');

  const { description, expirationDate } = req.body;

  if (!description || !expirationDate) {
    return res.status(400).send('Description and expiration date are required');
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (!(expirationDate instanceof Date) || isNaN(expirationDate.getTime())) {
    return res.status(400).send('Expiration date must be a valid date');
  }

  await AppDataSource.manager.update(
    Batch,
    { id: batchs.id },
    {
      description: description.trim(),
      expirationDate
    }
  );

  res.status(201).json(batchs);
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

  if (!batchs) return res.status(400).send('Batch not found');

  await AppDataSource.manager.delete(
    Batch,
    { id: batchs.id }
  );

  res.send(batchs);
});

export default router;

