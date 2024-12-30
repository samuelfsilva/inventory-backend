import express, { Request, Response, Router } from "express";
import Joi from "joi";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/user";

const router: Router = express.Router();

const userSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(150).required(),
  lastName: Joi.string().trim().min(1).max(150).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "The password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces",
      "string.pattern.alphanum":
        "The password must contain at least one letter",
      "string.pattern.num": "The password must contain at least one number",
      "string.pattern.special":
        "The password must contain at least one special character",
      "string.pattern.noSpaces": "The password must not contain spaces",
      "string.max": "The password must contain at most 30 characters",
    })
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s)[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    ),
});

const userParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Create a user'
  */

  const { error, value } = userSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { firstName, lastName, email, password } = value;

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
});

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

router.get("/firstName/:firstName", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Get all users by first name'
  */

  const users = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.firstName LIKE :firstName", {
      firstName: `%${req.params.firstName}%`,
    })
    .getMany();

  res.status(200).json(users);
});

router.get("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Get a user'
  */
  const { error: errorParams, value: valueParams } = userParamsSchema.validate(
    req.params
  );

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id })
    .getOne();

  res.status(200).json(user);
});

router.put("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Update a user'
  */
  const { error: errorParams, value: valueParams } = userParamsSchema.validate(
    req.params
  );

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const { error, value } = userSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { firstName, lastName, email, password } = value;

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
});

router.delete("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Delete a user'
  */
  const { error: errorParams, value: valueParams } = userParamsSchema.validate(
    req.params
  );

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

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
});

export default router;
