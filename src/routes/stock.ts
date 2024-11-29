import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Stock } from '../entities/stock';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const stockSchema = Joi.object({
  quantity: Joi.number().required(),
  product: Joi.object({
    id: Joi.string().required()
  }).required()
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = stockSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { product: { id: productId }, quantity } = req.body;

  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return res.status(400).send('Product id must be a non-empty string');
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).send('Quantity must be a positive number');
  }

  const stock = new Stock();
  stock.quantity = quantity;

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  
  if (!product) return res.status(400).send('Product not found');

  stock.product = product;

  await AppDataSource.manager.save(stock);

  res.status(201).json(stock);
});

router.get('/', async (req: Request, res: Response) => {
  const stocks = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .getMany();
  
  res.send(stocks);
});

router.get('/active', async (req: Request, res: Response) => {
  const stocks = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.isActive = :isActive", { isActive: true })
    .getMany();
  
  res.send(stocks);
});

router.get('/:id', async (req: Request, res: Response) => {
  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: req.params.id })
    .getOne();
  
  res.status(201).json(stock);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { producto: { id: productId }, quantity } = req.body;

  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return res.status(400).send('Product id must be a non-empty string');
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).send('Quantity must be a positive number');
  }
  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: id })
    .getOne();
  
  if (!stock) return res.status(400).send('Stock not found');

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  
  if (!product) return res.status(400).send('Product not found');
  
  await AppDataSource
    .manager
    .update(
      Stock, 
      { id: stock.id }, 
      { 
        quantity,
        product
      })

  res.status(201).json(stock);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: req.params.id })
    .getOne();
  
  if (!stock) return res.status(400).send('Stock not found');
  
  await AppDataSource
    .manager
    .delete(
      Stock, 
      { id: stock.id })
  
  res.send(stock);
});

export default router;
