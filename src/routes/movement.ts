import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Movement } from '../entities/movement';
import { User } from '../entities/user';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const movementSchema = Joi.object({
  userId: Joi.string().trim().length(36).required(),
  movementDate: Joi.date().max('now').required(),
  isActive: Joi.boolean().required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Create a new movement'
  */
  const { error, value } = movementSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { isActive, movementDate, userId } = value;

  const userExists = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne();

  if (!userExists) return res.status(400).json({
    error: {
      userId: 'User not found'
    }
  })

  const movement = new Movement();
  movement.isActive = isActive;
  movement.movementDate = movementDate;
  movement.user = userExists;

  await AppDataSource.manager.save(movement);

  res.status(201).json(movement);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements'
  */
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .leftJoinAndSelect("movement.user", "user")
    .getMany();
  
  res.status(200).json(movements);
});

router.get('/active', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all active movements'
  */
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.isActive = :isActive", { isActive: 1 })
    .getMany();
  
  res.status(200).json(movements);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get a movement by ID'
  */
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .getOne();
  
  res.status(200).json(movement);
});

router.get('/:id/items', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get a movement by ID'
  */
  const movement = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.id = :id", { id: req.params.id })
    .leftJoinAndSelect("movement.items", "movement_item")
    .leftJoinAndSelect("movementItems.product", "product")
    .getOne();
  
  res.status(200).json(movement);
});

router.get('/movementPeriod/:startDate/:endDate', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements in a given period'
  */
  const movementPeriodSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
  });

  const { error, value } = movementPeriodSchema.validate(req.params);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { startDate, endDate } = value;

  if (startDate > endDate) {
    return res.status(400).json({
      error: {
        startDate: 'Start date must be before end date'
      }
    })
  }
  
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.movementDate >= :startDate AND movement.movementDate <= :endDate", { startDate, endDate })
    .getMany();
  
  res.status(200).json(movements);
});

router.get('/movementDate/:movementDate', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements in a given date'
  */

  const movementDateSchema = Joi.object({
    movementDate: Joi.date().required()
  });

  const { error, value } = movementDateSchema.validate(req.params);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { movementDate } = value;
  
  if (isNaN(movementDate.getTime())) return res.status(400).json({
    error: {
      movementDate: 'Invalid date'
    }
  });
  
  const movements = await AppDataSource
    .getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.movementDate = :movementDate", { movementDate })
    .getMany();
  
  res.status(200).json(movements);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Update a movement by ID'
  */
  const id = req.params.id;

  const { error, value } = movementSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { isActive, movementDate, userId } = value;

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
    return res.status(400).json({
      error: {
        id: 'Movement not found'
      }
    });
  }

  if (!user) {
    return res.status(400).json({
      error: {
        userId: 'User not found'
      }
    });
  }

  await AppDataSource
    .manager
    .update(
      Movement, 
      { id: movement.id }, 
      { 
        isActive,
        movementDate,
        user
      })

  res.status(200).json(movement);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Delete a movement by ID'
  */
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
  
  res.status(204).send();
});
export default router;


