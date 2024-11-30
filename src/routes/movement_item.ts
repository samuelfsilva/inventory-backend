import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { MovementItem } from '../entities/movement_item';
import { Movement } from '../entities/movement';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const movementItemSchema = Joi.object({
  details: Joi.string().optional(),
  price: Joi.number().required(),
  quantity: Joi.number().optional(),
  movementId: Joi.string().required(),
  productId: Joi.string().required()
});

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['MovementItem']
  // #swagger.description = 'Create a new movement item'
  const { error } = movementItemSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { details, price, quantity, movementId, productId } = req.body;

  if (!details || typeof details !== 'string' || details.trim() === '') {
    return res.status(400).send('Details must be a non-empty string');
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).send('Price must be a positive number');
  }

  if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
    return res.status(400).send('Quantity must be a non-negative number');
  }

  if (!movementId || typeof movementId !== 'string' || movementId.trim() === '') {
    return res.status(400).send('Movement ID must be a non-empty string');
  }

  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return res.status(400).send('Product ID must be a non-empty string');
  }

  const movement = await AppDataSource.getRepository(Movement).findOneBy({ id: movementId });
  if (!movement) return res.status(400).send('Movement not found');

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  if (!product) return res.status(400).send('Product not found');

  const movementItem = new MovementItem();
  movementItem.movement = movement;
  movementItem.product = product;
  movementItem.details = details.trim();
  movementItem.price = price;
  movementItem.quantity = quantity;

  await AppDataSource.manager.save(movementItem);

  res.status(201).json(movementItem);
});

router.get('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['MovementItem']
  // #swagger.description = 'Get all movement items'
  const movementItems = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .leftJoinAndSelect("movementItem.movement", "movement")
    .leftJoinAndSelect("movementItem.product", "product")
    .getMany();

  res.send(movementItems);
});

router.get('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['MovementItem']
  // #swagger.description = 'Get a movement item by ID'
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(movementItem);
});

router.put('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['MovementItem']
  // #swagger.description = 'Update a movement item by ID'
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  if (!movementItem) return res.status(400).send('Movement item not found');

  const { details, price, quantity } = req.body;

  if (!details || typeof details !== 'string' || details.trim() === '') {
    return res.status(400).send('Details must be a non-empty string');
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).send('Price must be a positive number');
  }

  if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
    return res.status(400).send('Quantity must be a non-negative number');
  }

  await AppDataSource.manager.update(
    MovementItem,
    { id: movementItem.id },
    {
      details: details.trim(),
      price,
      quantity
    }
  );

  res.status(201).json(movementItem);
});

router.delete('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['MovementItem']
  // #swagger.description = 'Delete a movement item by ID'
  const movementItem = await AppDataSource
    .getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .where("movementItem.id = :id", { id: req.params.id })
    .getOne();

  if (!movementItem) return res.status(400).send('Movement item not found');

  await AppDataSource.manager.delete(
    MovementItem,
    { id: movementItem.id }
  );

  res.send(movementItem);
});

export default router;


