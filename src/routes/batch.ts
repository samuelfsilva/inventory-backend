import express, { Request, Response, Router } from "express";
import { Batch } from "../entities/batch";
import { Product } from "../entities/product";
import validator from "../middleware/validator";
import createBatchSchema from "../schemas/batch/createBatchSchema";
import paramsBatchSchema from "../schemas/batch/paramsBatchSchema";
import updateBatchSchema from "../schemas/batch/updateBatchSchema";
import { AppDataSource } from "../server";

const router: Router = express.Router();

router.post(
  "/",
  validator(createBatchSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Create a new batch'
  */
    const { description, expirationDate, productId } = req.body;

    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :id", { id: productId })
      .getOne();

    if (!product)
      return res.status(400).json({
        error: {
          productId: "Product not found",
        },
      });

    const batch = new Batch();
    batch.description = description;
    batch.expirationDate = expirationDate;
    batch.product = product;

    await AppDataSource.manager.save(batch);

    res.status(201).json(batch);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Get all batches'
  */
  const batchs = await AppDataSource.getRepository(Batch)
    .createQueryBuilder("batch")
    .getMany();

  res.status(200).json(batchs);
});

router.get(
  "/:id",
  validator(paramsBatchSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Get a batch by id'
  */

    const { id } = req.params;

    const batch = await AppDataSource.getRepository(Batch)
      .createQueryBuilder("batch")
      .where("batch.id = :id", { id })
      .getOne();

    res.status(200).json(batch);
  }
);

router.put(
  "/:id",
  validator(paramsBatchSchema, "params"),
  validator(updateBatchSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Update a batch by id'
  */

    const { id } = req.params;

    const batchs = await AppDataSource.getRepository(Batch)
      .createQueryBuilder("batch")
      .where("batch.id = :id", { id })
      .getOne();

    if (!batchs)
      return res.status(400).json({
        error: {
          id: "Batch not found",
        },
      });

    const { description, expirationDate, productId } = req.body;

    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :id", { id: productId })
      .getOne();

    if (!product)
      return res.status(400).json({
        error: {
          productId: "Product not found",
        },
      });

    await AppDataSource.manager.update(
      Batch,
      { id: batchs.id },
      {
        description,
        expirationDate,
        product,
      }
    );

    res.status(200).json(batchs);
  }
);

router.delete(
  "/:id",
  validator(paramsBatchSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Batch']
    #swagger.description = 'Delete a batch by id'
  */

    const { id } = req.params;

    const batchs = await AppDataSource.getRepository(Batch)
      .createQueryBuilder("batch")
      .where("batch.id = :id", { id })
      .getOne();

    if (!batchs)
      return res.status(400).json({
        error: {
          id: "Batch not found",
        },
      });

    await AppDataSource.manager.delete(Batch, { id: batchs.id });

    res.status(204).send();
  }
);

export default router;
