import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Movement } from "../entities/movement";
import { MovementItem } from "../entities/movement_item";
import { Product } from "../entities/product";
import validator from "../middleware/validator";
import createMovementItemSchema from "../schemas/movement_item/createMovementItemSchema";
import { paramsMovementItemSchema } from "../schemas/movement_item/paramsMovementItemSchema";
import updateMovementItemSchema from "../schemas/movement_item/updateMovementItemSchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createMovementItemSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Create a new movement item'
  */

    const { details, price, quantity, movementId, productId } = req.body;

    const movement = await AppDataSource.getRepository(Movement).findOneBy({
      id: movementId,
    });
    if (!movement)
      return res.status(400).json({
        error: {
          movementId: "Movement not found",
        },
      });

    const product = await AppDataSource.getRepository(Product).findOneBy({
      id: productId,
    });
    if (!product)
      return res.status(400).json({
        error: {
          productId: "Product not found",
        },
      });

    const movementItem = new MovementItem();
    movementItem.movement = movement;
    movementItem.product = product;
    movementItem.details = details;
    movementItem.price = price;
    movementItem.quantity = quantity;

    await AppDataSource.manager.save(movementItem);

    res.status(201).json(movementItem);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Get all movement items'
  */
  const movementItems = await AppDataSource.getRepository(MovementItem)
    .createQueryBuilder("movementItem")
    .leftJoinAndSelect("movementItem.movement", "movement")
    .leftJoinAndSelect("movementItem.product", "product")
    .getMany();

  res.status(200).json(movementItems);
});

router.get(
  "/:id",
  validator(paramsMovementItemSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Get a movement item by ID'
  */
    const { id } = req.params;

    const movementItem = await AppDataSource.getRepository(MovementItem)
      .createQueryBuilder("movementItem")
      .where("movementItem.id = :id", { id })
      .getOne();

    res.status(200).json(movementItem);
  }
);

router.put(
  "/:id",
  validator(paramsMovementItemSchema, "params"),
  validator(updateMovementItemSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Update a movement item by ID'
  */
    const { id } = req.params;

    const movementItem = await AppDataSource.getRepository(MovementItem)
      .createQueryBuilder("movementItem")
      .where("movementItem.id = :id", { id })
      .getOne();

    if (!movementItem)
      return res.status(400).json({
        error: {
          id: "Movement item not found",
        },
      });

    const { details, price, quantity } = req.body;

    await AppDataSource.manager.update(
      MovementItem,
      { id: movementItem.id },
      {
        details,
        price,
        quantity,
      }
    );

    res.status(200).json(movementItem);
  }
);

router.delete(
  "/:id",
  validator(paramsMovementItemSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['MovementItem']
    #swagger.description = 'Delete a movement item by ID'
  */

    const { id } = req.params;

    const movementItem = await AppDataSource.getRepository(MovementItem)
      .createQueryBuilder("movementItem")
      .where("movementItem.id = :id", { id })
      .getOne();

    if (!movementItem)
      return res.status(400).json({
        error: {
          id: "Movement item not found",
        },
      });

    await AppDataSource.manager.delete(MovementItem, { id: movementItem.id });

    res.status(204).send();
  }
);

export default router;
