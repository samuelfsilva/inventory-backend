import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Deposit } from "../entities/deposit";
import validator from "../middleware/validator";
import createDepositSchema from "../schemas/deposit/createDepositSchema";
import { paramsDepositSchema } from "../schemas/deposit/paramsDepositSchema";
import updateDepositSchema from "../schemas/deposit/updateDepositSchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createDepositSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Create a new deposit'
  */
    const { name, description } = req.body;

    const depositExists = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("UPPER(deposit.name) = UPPER(:name)", { name })
      .getOne();

    if (depositExists) {
      return res.status(400).json({
        error: {
          name: "Deposit already exists",
        },
      });
    }

    const deposit = new Deposit();
    deposit.name = name;
    deposit.description = description;
    deposit.isActive = true;

    await AppDataSource.manager.save(deposit);

    res.status(201).json(deposit);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Get all deposits'
  */
  const deposits = await AppDataSource.getRepository(Deposit)
    .createQueryBuilder("deposit")
    .getMany();

  res.status(200).json(deposits);
});

router.get(
  "/:id",
  validator(paramsDepositSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Get a deposit by ID'
  */

    const { id } = req.params;

    const deposit = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("deposit.id = :id", { id })
      .getOne();

    res.status(200).json(deposit);
  }
);

router.put(
  "/:id",
  validator(paramsDepositSchema, "params"),
  validator(updateDepositSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Update a deposit by ID'
  */

    const { id } = req.params;

    const deposit = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("deposit.id = :id", { id })
      .getOne();

    if (!deposit)
      return res.status(400).json({
        error: {
          id: "Deposit not found",
        },
      });

    const { name, description, isActive } = req.body;

    const depositExists = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("UPPER(deposit.name) = UPPER(:name)", { name })
      .andWhere("deposit.id != :id", { id: deposit.id })
      .getOne();

    if (depositExists) {
      return res.status(400).json({
        error: {
          name: "Deposit already exists",
        },
      });
    }

    await AppDataSource.manager.update(
      Deposit,
      { id: deposit.id },
      {
        name,
        description,
        isActive,
      }
    );

    res.status(200).json(deposit);
  }
);

router.delete(
  "/:id",
  validator(paramsDepositSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Deposit']
    #swagger.description = 'Delete a deposit by ID'
  */

    const { id } = req.params;

    const deposit = await AppDataSource.getRepository(Deposit)
      .createQueryBuilder("deposit")
      .where("deposit.id = :id", { id })
      .getOne();

    if (!deposit)
      return res.status(400).json({
        error: {
          id: "Deposit not found",
        },
      });

    await AppDataSource.manager.delete(Deposit, { id: deposit.id });

    res.status(204).send();
  }
);

export default router;
