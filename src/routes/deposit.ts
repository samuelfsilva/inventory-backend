import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Deposit } from '../entities/deposit';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const depositSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().min(1).max(250).optional()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Create a new deposit'
  */
  const { error, value } = depositSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { name, description } = value;

  const deposit = new Deposit();
  deposit.name = name;
  deposit.description = description;
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

  res.status(200).json(deposits);
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

  res.status(200).json(deposit);
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

  if (!deposit) return res.status(400).json({
    error: {
      id: 'Deposit not found'
    }
  });

  const { error, value } = depositSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }
  
  const { name, description } = value;

  await AppDataSource.manager.update(
    Deposit,
    { id: deposit.id },
    {
      name,
      description
    }
  );

  res.status(200).json(deposit);
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

  if (!deposit) return res.status(400).json({
    error: {
      id: 'Deposit not found'
    }
  });

  await AppDataSource.manager.delete(
    Deposit,
    { id: deposit.id }
  );

  res.status(204).send();
});

export default router;

