import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Stock } from '../entities/stock';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const stockSchema = Joi.object({
  quantity: Joi.number().min(0).required(),
  productId: Joi.string().trim().length(36).required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Create a new stock'
  */

  const { error, value } = stockSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { productId, quantity } = value;

  const stock = new Stock();
  stock.quantity = quantity;

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  
  if (!product) return res.status(400).json({
    error: {
      message: 'Product not found'
    }
  });

  stock.product = product;

  await AppDataSource.manager.save(stock);

  res.status(201).json(stock);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks'
  */

  const stocks = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .getMany();
  
  res.status(200).json(stocks);
});

router.get('/active', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all active stocks'
  */

  const stocks = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.isActive = :isActive", { isActive: true })
    .getMany();
  
  res.status(200).json(stocks);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get a stock by id' 
  */

  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: req.params.id })
    .getOne();
  
  res.status(200).json(stock);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Update a stock'
  */

  const { id } = req.params;

  const { error, value } = stockSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { productId, quantity } = value;

  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: id })
    .getOne();
  
  if (!stock) return res.status(400).json({
    error: {
      id: 'Stock not found'
    }
  });

  const product = await AppDataSource.getRepository(Product).findOneBy({ id: productId });
  
  if (!product) return res.status(400).json({
    error: {
      product: 'Product not found'
    }
  });
  
  await AppDataSource
    .manager
    .update(
      Stock, 
      { id: stock.id }, 
      { 
        quantity,
        product
      })

  res.status(200).json(stock);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Delete a stock'
  */

  const stock = await AppDataSource
    .getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id: req.params.id })
    .getOne();
  
  if (!stock) return res.status(400).json({
    error: {
      id: 'Stock not found'
    }
  });
  
  await AppDataSource
    .manager
    .delete(
      Stock, 
      { id: stock.id })
  
  res.status(204).send();
});

export default router;
