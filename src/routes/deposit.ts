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
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Create a new deposit'
  */
  const { error } = depositSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).send('Name must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (name.length > 255) {
    return res.status(400).send('Name too long, must be less than 255 characters');
  }

  if (description.length > 255) {
    return res.status(400).send('Description too long, must be less than 255 characters');
  }

  const deposit = new Deposit();
  deposit.name = name.trim();
  deposit.description = description.trim();
  deposit.isActive = true;

  await AppDataSource.manager.save(deposit);

  res.status(201).json(deposit);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Get all deposits'
  */
  const deposits = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .getMany();

  res.send(deposits);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Get a deposit by ID'
  */
  const deposit = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .where("deposit.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(deposit);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Update a deposit by ID'
  */
  const deposit = await AppDataSource
    .getRepository(Deposit)
    .createQueryBuilder("deposit")
    .where("deposit.id = :id", { id: req.params.id })
    .getOne();

  if (!deposit) return res.status(400).send('Deposit not found');

  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).send('Name must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (name.length > 255) {
    return res.status(400).send('Name too long, must be less than 255 characters');
  }

  if (description.length > 255) {
    return res.status(400).send('Description too long, must be less than 255 characters');
  }

  await AppDataSource.manager.update(
    Deposit,
    { id: deposit.id },
    {
      name: name.trim(),
      description: description.trim()
    }
  );

  res.status(201).json(deposit);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Delete a deposit by ID'
  */
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

