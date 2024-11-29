import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Movement } from '../entities/movement';
import { User } from '../entities/user';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const movementSchema = Joi.object({
  isActive: Joi.boolean().required(),
  movementDate: Joi.date().required(),
  user: Joi.object({
    id: Joi.string().required()
  }).required()
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = movementSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isActive, movementDate, user: { id: userId } } = req.body;

  if (typeof isActive !== 'boolean') return res.status(400).send('isActive must be a boolean');
  if (isNaN(movementDate.getTime())) return res.status(400).send('movementDate must be a valid Date');
  if (typeof userId !== 'string' || userId.trim() === '') return res.status(400).send('userId must be a non-empty string');

  const userExists = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne();

  if (!userExists) return res.status(400).send('User not found');

  const movement = new Movement();
  movement.isActive = isActive;
  movement.movementDate = movementDate;
  movement.user = userExists;

  await AppDataSource.manager.save(movement);

  res.status(201).json(movement);
});

router.get('/', async (req: Request, res: Response) => {
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .leftJoinAndSelect("movement.user", "user")
    .getMany();
  
  res.send(movements);
});

router.get('/active', async (req: Request, res: Response) => {
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.isActive = :isActive", { isActive: 1 })
    .getMany();
  
  res.send(movements);
});

router.get('/:id', async (req: Request, res: Response) => {
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .getOne();
  
  res.status(201).json(movement);
});

router.get('/:id/items', async (req: Request, res: Response) => {
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .leftJoinAndSelect("movement.movementItems", "movement_item")
    .leftJoinAndSelect("movementItems.product", "product")
    .getOne();
  
  res.status(201).json(movement);
});

router.get('/:id/items', async (req: Request, res: Response) => {
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .leftJoinAndSelect("movement.items", "movementItem")
    .leftJoinAndSelect("movementItems.product", "product")
    .getOne();
  
  res.status(201).json(movement);
});

router.get('/movementPeriod/:startDate/:endDate', async (req: Request, res: Response) => {
  const { startDate: startDateString, endDate: endDateString } = req.params;
  let startDate: Date, endDate: Date;
  try {
    startDate = new Date(startDateString);
    endDate = new Date(endDateString);
  } catch {
    return res.status(400).send('Invalid date format. Please use the format: YYYY-MM-DD');
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).send('Invalid date format. Please use the format: YYYY-MM-DD');
  }

  if (startDate > endDate) {
    return res.status(400).send('Start date cannot be greater than end date');
  }
  
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.movementDate >= :startDate AND movement.movementDate <= :endDate", { startDate, endDate })
    .getMany();
  
  res.send(movements);
});

router.get('/movementDate/:movementDate', async (req: Request, res: Response) => {
  let movementDate: Date;

  try {
    movementDate = new Date(req.params.movementDate);
  } catch {
    return res.status(400).send('Invalid order date');
  }
  
  if (isNaN(movementDate.getTime())) return res.status(400).send('Invalid order date');
  
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.movementDate = :movementDate", { movementDate })
    .getMany();
  
  res.send(movements);
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { isActive, movementDate, user: { id: userId } } = req.body;

  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder('movement')
    .where('movement.id = :movementId', { movementId: id })
    .getOne();

  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId: userId })
    .getOne();

    
  if (!movement) {
    return res.status(400).send('Movement not found');
  }

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (typeof isActive !== 'boolean') {
    return res.status(400).send('isActive must be a boolean');
  }

  if (isNaN(Date.parse(movementDate))) {
    return res.status(400).send('Movement date must be a valid Date');
  }

  if (typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).send('User Id must be a non-empty string');
  }

  await AppDataSource
    .manager
    .update(
      Movement, 
      { id: movement.id }, 
      { 
        isActive: isActive,
        movementDate: movementDate,
        user
      })

  res.status(201).json(movement);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .getOne();
  
  if (!movement) return res.status(400).send('Movement not found');
  
  await AppDataSource
    .manager
    .delete(
      Movement, 
      { id: movement.id })
  
  res.send(movement);
});

export default router;


