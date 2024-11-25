import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Deposit } from '../entities/deposit';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const depositSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = depositSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description } = req.body;

  const deposit = new Deposit();
  deposit.name = name;
  deposit.description = description;
  deposit.isActive = true;

  await AppDataSource.manager.save(deposit);

  res.status(201).json(deposit);
});

router.get('/', async (req: Request, res: Response) => {
  const deposits = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .getMany();

  res.send(deposits);
});

router.get('/:id', async (req: Request, res: Response) => {
  const deposit = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .where("deposit.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(deposit);
});

router.put('/:id', async (req: Request, res: Response) => {
  const deposit = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .where("deposit.id = :id", { id: req.params.id })
    .getOne();

  if (!deposit) return res.status(400).send('Deposit not found');

  const { name, description } = req.body;

  await AppDataSource.manager.update(
    Deposit,
    { id: deposit.id },
    {
      name,
      description
    }
  );

  res.status(201).json(deposit);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deposit = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .where("deposit.id = :id", { id: req.params.id })
    .getOne();

  if (!deposit) return res.status(400).send('Deposit not found');

  await AppDataSource.manager.delete(
    Deposit,
    { id: deposit.id }
  );

  res.send(deposit);
});

export default router;

