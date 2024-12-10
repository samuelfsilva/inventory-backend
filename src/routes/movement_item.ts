import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { MovementItem } from '../entities/movement_item';
import { Movement } from '../entities/movement';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const movementItemSchema = Joi.object({
  details: Joi.string().trim().min(1).max(250).optional(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  movementId: Joi.string().trim().length(36).required(),
  productId: Joi.string().trim().length(36).required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Create a new movement item'
  */
  
  const { error, value } = movementItemSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { details, price, quantity, movementId, productId } = value;

  const movement = await AppDataSource.getRepository(Movement).findOneBy({ id: movementId });
  if (!movement) return res.status(400).json({
    error: {
      movementId: 'Movement not found'
    }
  });

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  if (!product) return res.status(400).json({
    error: {
      productId: 'Product not found'
    }
  });

  const movementItem = new MovementItem();
  movementItem.movement = movement;
  movementItem.product = product;
  movementItem.details = details;
  movementItem.price = price;
  movementItem.quantity = quantity;

  await AppDataSource.manager.save(movementItem);

  res.status(201).json(movementItem);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Get all movement items'
  */
  const movementItems = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .leftJoinAndSelect("movementItem.movement", "movement")
    .leftJoinAndSelect("movementItem.product", "product")
    .getMany();

  res.status(200).json(movementItems);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Get a movement item by ID'
  */
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  res.status(200).json(movementItem);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Update a movement item by ID'
  */
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  if (!movementItem) return res.status(400).json({
    error: {
      id: 'Movement item not found'
    }
  })

  const { error, value } = movementItemSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { details, price, quantity } = value;

  await AppDataSource.manager.update(
    MovementItem,
    { id: movementItem.id },
    {
      details,
      price,
      quantity
    }
  );

  res.status(200).json(movementItem);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Delete a movement item by ID'
  */
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  if (!movementItem) return res.status(400).json({
    error: {
      id: 'Movement item not found'
    }
  });

  await AppDataSource.manager.delete(
    MovementItem,
    { id: movementItem.id }
  );

  res.status(204).send();
});

export default router;


