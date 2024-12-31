import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Batch } from "../entities/batch";
import { Deposit } from "../entities/deposit";
import { Stock } from "../entities/stock";
import validator from "../middleware/validator";
import createStockSchema from "../schemas/stock/createStockSchema";
import { paramsStockSchema } from "../schemas/stock/paramsStockSchema";
import updateStockSchema from "../schemas/stock/updateStockSchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createStockSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Create a new stock'
  */

    const { batchId, quantity, depositId } = req.body;

    const stockExists = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.batch.id = :batchId", { batchId })
      .andWhere("stock.deposit.id = :depositId", { depositId })
      .getOne();

    if (stockExists) {
      return res.status(400).json({
        error: {
          id: "Stock already exists",
        },
      });
    }

    const stock = new Stock();
    stock.quantity = quantity;

    const batch = await AppDataSource.getRepository(Batch).findOneBy({
      id: batchId,
    });

    if (!batch)
      return res.status(400).json({
        error: {
          batch: "Batch not found",
        },
      });

    stock.batch = batch;

    const deposit = await AppDataSource.getRepository(Deposit).findOneBy({
      id: depositId,
    });

    if (!deposit)
      return res.status(400).json({
        error: {
          deposit: "Deposit not found",
        },
      });

    stock.deposit = deposit;

    await AppDataSource.manager.save(stock);

    res.status(201).json(stock);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks'
  */

  const stocks = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .getMany();

  res.status(200).json(stocks);
});

router.get("/active", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all active stocks'
  */

  const stocks = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.isActive = :isActive", { isActive: true })
    .getMany();

  res.status(200).json(stocks);
});

router.get(
  "/:id",
  validator(paramsStockSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get a stock by id' 
  */
    const { id } = req.params;

    const stock = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.id = :id", { id })
      .getOne();

    res.status(200).json(stock);
  }
);

router.get(
  "/deposit/:id",
  validator(paramsStockSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by deposit'
  */

    const { id: depositId } = req.params;

    const stocks = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.deposit.id = :depositId", { depositId })
      .getMany();

    res.status(200).json(stocks);
  }
);

router.get(
  "/batch/:id",
  validator(paramsStockSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by batch'
  */

    const { id: batchId } = req.params;

    const stocks = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.batch.id = :batchId", { batchId })
      .getMany();

    res.status(200).json(stocks);
  }
);

router.get(
  "/product/:id",
  validator(paramsStockSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by product'
  */

    const { id: productId } = req.params;

    const stocks = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .leftJoinAndSelect("stock.batch", "batch")
      .where("batch.product.id = :productId", { productId })
      .getMany();

    res.status(200).json(stocks);
  }
);

router.put(
  "/:id",
  validator(paramsStockSchema, "params"),
  validator(updateStockSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Update a stock'
  */

    const { id } = req.params;

    const { batchId, quantity, depositId } = req.body;

    const stock = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.id = :id", { id })
      .getOne();

    if (!stock)
      return res.status(400).json({
        error: {
          id: "Stock not found",
        },
      });

    const deposit = await AppDataSource.getRepository(Deposit).findOneBy({
      id: depositId,
    });

    if (!deposit)
      return res.status(400).json({
        error: {
          deposit: "Deposit not found",
        },
      });

    const batch = await AppDataSource.getRepository(Batch).findOneBy({
      id: batchId,
    });

    if (!batch)
      return res.status(400).json({
        error: {
          batch: "Batch not found",
        },
      });

    await AppDataSource.manager.update(
      Stock,
      { id: stock.id },
      {
        quantity,
        batch,
        deposit,
      }
    );

    res.status(200).json(stock);
  }
);

router.delete(
  "/:id",
  validator(paramsStockSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Delete a stock'
  */
    const { id } = req.params;

    const stock = await AppDataSource.getRepository(Stock)
      .createQueryBuilder("stock")
      .where("stock.id = :id", { id })
      .getOne();

    if (!stock)
      return res.status(400).json({
        error: {
          id: "Stock not found",
        },
      });

    await AppDataSource.manager.delete(Stock, { id: stock.id });

    res.status(204).send();
  }
);

export default router;
