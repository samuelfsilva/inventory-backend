import express, { Router, Request, Response } from 'express';
import Joi from 'joi';
import { User } from '../entities/user';
import { AppDataSource } from '../database/data-source';

const router: Router = express.Router();

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Create a new user'
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).send('First name must be a non-empty string');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).send('Last name must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).send('Email must be a non-empty string');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Password must be a non-empty string');
  }

  if (/\s/.test(password)) {
    return res.status(400).send('Password must not contain spaces');
  }
  
  const userExists = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: email })
    .getOne();

  if (userExists) return res.status(400).send('Email already registered');

  const user = new User();
  user.firstName = firstName.trim();
  user.lastName = lastName.trim();
  user.email = email.trim();
  user.password = password;

  await AppDataSource.manager.save(user);

  res.status(201).json(user);
});

router.get('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Get all users'
  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .getMany();
  
  res.send(users);
});

router.get('/active', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Get all active users'
  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.isActive = :isActive", { isActive: true })
    .getMany();
  
  res.send(users);
});

router.get('/firstName/:firstName', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Get all users with first name like :firstName'
  const users = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.firstName LIKE :firstName", { firstName: `%${req.params.firstName}%` })
    .getMany();
  
  res.send(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Get user by id'
  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: req.params.id })
    .getOne();
  
  res.status(201).json(user);
});

router.put('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Update a user'
  const { firstName, lastName, email, password } = req.body;

  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: req.params.id })
    .getOne();
  
  if (!user) return res.status(400).send('User not found');

  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).send('First name must be a non-empty string');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).send('Last name must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).send('Email must be a non-empty string');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Password must be a non-empty string');
  }

  if (/\s/.test(password)) {
    return res.status(400).send('Password must not contain spaces');
  }
  
  await AppDataSource
    .manager
    .update(
      User, 
      { id: user.id }, 
      { 
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password
      })

  res.status(201).json(user);
});

router.delete('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Delete user by id'
  const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: req.params.id })
    .getOne();
  
  if (!user) return res.status(400).send('User not found');
  
  await AppDataSource
    .manager
    .delete(
      User, 
      { id: user.id })
  
  res.send(user);
});

export default router;