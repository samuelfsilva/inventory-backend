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
  const { error } = batchSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { description, expirationDate } = req.body;

  const batch = new Batch();
  batch.description = description;
  batch.expirationDate = expirationDate;

  await AppDataSource.manager.save(batch);

  res.status(201).json(batch);
});

router.get('/', async (req: Request, res: Response) => {
  const batchs = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .getMany();

  res.send(batchs);
});

router.get('/:id', async (req: Request, res: Response) => {
  const batch = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(batch);
});

router.put('/:id', async (req: Request, res: Response) => {
  const batchs = await AppDataSource
    .getRepository(Batch)
    .createQueryBuilder("batch")
    .where("batch.id = :id", { id: req.params.id })
    .getOne();

  if (!batchs) return res.status(400).send('Batch not found');

  const { description, expirationDate } = req.body;

  await AppDataSource.manager.update(
    Batch,
    { id: batchs.id },
    {
      description,
      expirationDate
    }
  );

  res.status(201).json(batchs);
});

router.delete('/:id', async (req: Request, res: Response) => {
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

