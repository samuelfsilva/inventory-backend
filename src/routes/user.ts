import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/user";
import validator from "../middleware/validator";
import createUserSchema from "../schemas/user/createUserSchema";
import {
  firstNameUserSchema,
  paramsUserSchema,
} from "../schemas/user/paramsUserSchema";
import updateUserSchema from "../schemas/user/updateUserSchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createUserSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Create a user'
  */

    const { firstName, lastName, email, password } = req.body;

    const userExists = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();

    if (userExists)
      return res.status(400).json({
        error: {
          email: "Email already registered",
        },
      });

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;

    await AppDataSource.manager.save(user);

    res.status(201).json(user);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Get all users'
  */

  const users = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .getMany();

  res.status(200).json(users);
});

router.get("/active", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Get all active users'
  */

  const users = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.isActive = :isActive", { isActive: true })
    .getMany();

  res.status(200).json(users);
});

router.get(
  "/firstName/:firstName",
  validator(firstNameUserSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Get all users by first name'
  */
    const { firstName } = req.params;

    const users = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.firstName LIKE :firstName", {
        firstName: `%${firstName}%`,
      })
      .getMany();

    res.status(200).json(users);
  }
);

router.get(
  "/:id",
  validator(paramsUserSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Get a user'
  */
    const { id } = req.params;

    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne();

    res.status(200).json(user);
  }
);

router.put(
  "/:id",
  validator(paramsUserSchema, "params"),
  validator(updateUserSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Update a user'
  */
    const { id } = req.params;

    const { firstName, lastName, email, password } = req.body;

    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne();

    if (!user)
      return res.status(400).json({
        error: {
          id: "User not found",
        },
      });

    await AppDataSource.manager.update(
      User,
      { id: user.id },
      {
        firstName,
        lastName,
        email,
        password,
      }
    );

    res.status(200).json(user);
  }
);

router.delete(
  "/:id",
  validator(paramsUserSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['User']
    #swagger.description = 'Delete a user'
  */
    const { id } = req.params;

    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne();

    if (!user)
      return res.status(400).json({
        error: {
          id: "User not found",
        },
      });

    await AppDataSource.manager.delete(User, { id: user.id });

    res.status(204).send();
  }
);

export default router;
