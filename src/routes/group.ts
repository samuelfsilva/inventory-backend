import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { Group } from '../entities/group';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const groupSchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required()
});

router.post('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Create a new group'
  */
  const { error, value } = groupSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { description } = value;

  const group = new Group();
  group.description = description;

  await AppDataSource.manager.save(group);

  res.status(201).json(group);
});

router.get('/', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get all groups'
  */
  const groups = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .getMany();

  res.status(200).json(groups);
});

router.get('/:id/products', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get all products from a group'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.id = :id", { id: req.params.id })
    .leftJoinAndSelect("group.products", "product")
    .getMany();

  res.status(200).json(group);
});

router.get('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.id = :id", { id: req.params.id })
    .getOne();

  res.status(200).json(group);
});

router.get('/description/:description', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group by description'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.description = :description", { description: req.params.description })
    .getOne();

  res.status(200).json(group);
});

router.get('/description-like/:description', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group by description like'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.description LIKE :description", { description: `%${req.params.description}%` })
    .getOne();

  res.status(200).json(group);
});

router.put('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Update a group'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.id = :id", { id: req.params.id })
    .getOne();

  if (!group) return res.status(400).json({
    error: {
      id: 'Group not found'
    }
  });

  const { error, value } = groupSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message
      }
    });
  }

  const { description } = value;

  await AppDataSource.manager.update(
    Group,
    { id: group.id },
    {
      description,
    }
  );

  res.status(200).json(group);
});

router.delete('/:id', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Delete a group'
  */
  const group = await AppDataSource
    .getRepository(Group)
    .createQueryBuilder("group")
    .where("group.id = :id", { id: req.params.id })
    .getOne();

  if (!group) return res.status(400).json({
    error: {
      id: 'Group not found'
    }
  });

  await AppDataSource.manager.delete(
    Group,
    { id: group.id }
  );

  res.status(204).send();
});

export default router;


