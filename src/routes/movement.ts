import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Movement } from "../entities/movement";
import { User } from "../entities/user";
import validator from "../middleware/validator";
import createMovementSchema from "../schemas/movement/createMovementSchema";
import {
  movementDateSchema,
  movementPeriodSchema,
  paramsMovementSchema,
} from "../schemas/movement/paramsMovementSchema";
import updateMovementSchema from "../schemas/movement/updateMovementSchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createMovementSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Create a new movement'
  */
    const { movementDate, userId } = req.body;

    const userExists = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!userExists)
      return res.status(400).json({
        error: {
          userId: "User not found",
        },
      });

    const movement = new Movement();
    movement.isActive = true;
    movement.movementDate = movementDate;
    movement.user = userExists;

    await AppDataSource.manager.save(movement);

    res.status(201).json(movement);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements'
  */
  const movements = await AppDataSource.getRepository(Movement)
    .createQueryBuilder("movement")
    .leftJoinAndSelect("movement.user", "user")
    .getMany();

  res.status(200).json(movements);
});

router.get("/active", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all active movements'
  */
  const movements = await AppDataSource.getRepository(Movement)
    .createQueryBuilder("movement")
    .where("movement.isActive = :isActive", { isActive: 1 })
    .getMany();

  res.status(200).json(movements);
});

router.get(
  "/:id",
  validator(paramsMovementSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get a movement by ID'
  */

    const { id } = req.params;

    const movement = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :id", { id })
      .getOne();

    res.status(200).json(movement);
  }
);

router.get(
  "/:id/items",
  validator(paramsMovementSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get a movement by ID'
  */

    const { id } = req.params;

    const movement = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :id", { id })
      .leftJoinAndSelect("movement.items", "movement_item")
      .leftJoinAndSelect("movementItems.product", "product")
      .getOne();

    res.status(200).json(movement);
  }
);

router.get(
  "/movementPeriod/:startDate/:endDate",
  validator(movementPeriodSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements in a given period'
  */
    const { startDate, endDate } = req.params;

    const movements = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where(
        "movement.movementDate >= :startDate AND movement.movementDate <= :endDate",
        { startDate, endDate }
      )
      .getMany();

    res.status(200).json(movements);
  }
);

router.get(
  "/movementDate/:movementDate",
  validator(movementDateSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Get all movements in a given date'
  */

    const { movementDate } = req.params;

    const movements = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.movementDate = :movementDate", { movementDate })
      .getMany();

    res.status(200).json(movements);
  }
);

router.put(
  "/:id",
  validator(paramsMovementSchema, "params"),
  validator(updateMovementSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Update a movement by ID'
  */
    const { id } = req.params;

    const { isActive, movementDate, userId } = req.body;

    const movement = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :movementId", { movementId: id })
      .getOne();

    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :userId", { userId: userId })
      .getOne();

    if (!movement) {
      return res.status(400).json({
        error: {
          id: "Movement not found",
        },
      });
    }

    if (!user) {
      return res.status(400).json({
        error: {
          userId: "User not found",
        },
      });
    }

    await AppDataSource.manager.update(
      Movement,
      { id: movement.id },
      {
        isActive,
        movementDate,
        user,
      }
    );

    res.status(200).json(movement);
  }
);

router.delete(
  "/:id",
  validator(paramsMovementSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Movement']
    #swagger.description = 'Delete a movement by ID'
  */

    const { id } = req.params;

    const movement = await AppDataSource.getRepository(Movement)
      .createQueryBuilder("movement")
      .where("movement.id = :id", { id })
      .getOne();

    if (!movement) return res.status(400).send("Movement not found");

    await AppDataSource.manager.delete(Movement, { id: movement.id });

    res.status(204).send();
  }
);

export default router;
