import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Product } from '../entities/product';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const productSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description, isActive } = req.body;

  const product = new Product();
  product.name = name;
  product.description = description;
  product.isActive = isActive;

  await AppDataSource.manager.save(product);

  res.status(201).json(product);
});

router.get('/', async (req: Request, res: Response) => {
  const products = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .getMany();

  res.send(products);
});

router.get('/active', async (req: Request, res: Response) => {
  const products = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.isActive = :isActive", { isActive: true })
    .getMany();

  res.send(products);
});

router.get('/:id', async (req: Request, res: Response) => {
  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(product);
});

router.put('/:id', async (req: Request, res: Response) => {
  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  if (!product) return res.status(400).send('Product not found');

  const { name, description, isActive } = req.body;

  await AppDataSource.manager.update(
    Product,
    { id: product.id },
    {
      name,
      description,
      isActive
    }
  );

  res.status(201).json(product);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const product = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: req.params.id })
    .getOne();

  if (!product) return res.status(400).send('Product not found');

  await AppDataSource.manager.delete(
    Product,
    { id: product.id }
  );

  res.send(product);
});

export default router;

