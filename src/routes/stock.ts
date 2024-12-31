import express, { Request, Response, Router } from "express";
import Joi from "joi";
import { AppDataSource } from "../database/data-source";
import { Batch } from "../entities/batch";
import { Deposit } from "../entities/deposit";
import { Stock } from "../entities/stock";

const router: Router = express.Router();

const stockSchema = Joi.object({
  quantity: Joi.number().min(0).required(),
  depositId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Deposit Id",
    })
    .required(),
  batchId: Joi.string().trim().uuid().messages({
    "string.guid": "Invalid Batch Id",
  }),
});

const stockParamsSchema = Joi.object({
  id: Joi.string().trim().uuid().required(),
});

router.post("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Create a new stock'
  */

  const { error, value } = stockSchema.validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { batchId, quantity, depositId } = value;

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
});

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

router.get("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get a stock by id' 
  */
  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const stock = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.id = :id", { id })
    .getOne();

  res.status(200).json(stock);
});

router.get("/deposit/:depositId", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by deposit'
  */

  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { depositId } = valueParams;

  const stocks = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.deposit.id = :depositId", { depositId })
    .getMany();

  res.status(200).json(stocks);
});

router.get("/batch/:batchId", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by batch'
  */

  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { batchId } = valueParams;

  const stocks = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .where("stock.batch.id = :batchId", { batchId })
    .getMany();

  res.status(200).json(stocks);
});

router.get("/product/:productId", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Get all stocks by product'
  */

  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { productId } = valueParams;

  const stocks = await AppDataSource.getRepository(Stock)
    .createQueryBuilder("stock")
    .leftJoinAndSelect("stock.batch", "batch")
    .where("batch.product.id = :productId", { productId })
    .getMany();

  res.status(200).json(stocks);
});

router.put("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Update a stock'
  */

  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const { error, value } = stockSchema.validate(req.body);

  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { batchId, quantity, depositId } = value;

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
});

router.delete("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Stock']
    #swagger.description = 'Delete a stock'
  */
  const { error: paramsError, value: valueParams } = stockParamsSchema.validate(
    req.params
  );

  if (paramsError) {
    const { path, message } = paramsError.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

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
});

export default router;
