import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const productSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().min(1).max(250).optional(),
  isActive: Joi.boolean().required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Create a new product'
  */

  const { error, value } = productSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }
  const { name, description, isActive } = value;

  const product = new Product();
  product.name = name;
  product.description = description;
  product.isActive = isActive;

  await AppDataSource.manager.save(product);

  res.status(201).json(product);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get all products'
  */

  const products = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .getMany();

  res.status(200).json(products);
});

router.get('/active', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get all active products'
  */

  const products = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.isActive = :isActive", { isActive: true })
    .getMany();

  res.status(200).json(products);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get a product by id'
  */

  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  res.status(200).json(product);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Update a product by id'
  */

  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  if (!product) return res.status(400).json({
    error: {
      id: 'Product not found'
    }
  });

  const { error, value } = productSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { name, description, isActive } = value;

  await AppDataSource.manager.update(
    Product,
    { id: product.id },
    {
      name,
      description,
      isActive
    }
  );

  res.status(200).json(product);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Delete a product by id'
  */

  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  if (!product) return res.status(400).json({
    error: {
      id: 'Product not found'
    }
  });

  await AppDataSource.manager.delete(
    Product,
    { id: product.id }
  );

  res.status(204).send();
});

export default router;

