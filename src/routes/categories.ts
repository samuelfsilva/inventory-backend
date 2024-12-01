import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Categories } from '../entities/categories';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const categoriesSchema = Joi.object({
  description: Joi.string().optional()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Create a category'
  */
  const { error } = categoriesSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { description } = req.body;

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (description.length > 255) {
    return res.status(400).send('Description too long, must be less than 255 characters');
  }

  const categories = new Categories();
  categories.description = description.trim();

  await AppDataSource.manager.save(categories);

  res.status(201).json(categories);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all categories'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .getMany();

  res.send(categories);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get a category by id'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id: req.params.id })
    .getOne();

  res.status(201).json(categories);
});

router.get('/description/:description', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get a category by description'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.description = :description", { description: req.params.description })
    .getOne();

  res.status(201).json(categories);
});

router.get('/description-like/:description', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all categories with description like :description'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.description LIKE :description", { description: `%${req.params.description}%` })
    .getMany();

  res.status(201).json(categories);
});

router.get('/:id/products', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all products of a category'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id: req.params.id })
    .leftJoinAndSelect("categories.products", "products")
    .getOne();

  res.status(201).json(categories);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Update a category'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id: req.params.id })
    .getOne();

  if (!categories) return res.status(400).send('Categories not found');

  const { description } = req.body;

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).send('Description must be a non-empty string');
  }

  if (description.length > 255) {
    return res.status(400).send('Description too long, must be less than 255 characters');
  }

  await AppDataSource.manager.update(
    Categories,
    { id: categories.id },
    {
      description: description.trim()
    }
  );

  res.status(201).json(categories);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Delete a category'
  */
  const categories = await AppDataSource
    .getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id: req.params.id })
    .getOne();

  if (!categories) return res.status(400).send('Categories not found');

  await AppDataSource.manager.delete(
    Categories,
    { id: categories.id }
  );

  res.send(categories);
});

export default router;

