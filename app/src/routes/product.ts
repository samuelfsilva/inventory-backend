import express, { Request, Response, Router } from "express";
import { Category } from "../entities/category";
import { Group } from "../entities/group";
import { Product } from "../entities/product";
import validator from "../middleware/validator";
import createProductSchema from "../schemas/product/createProductSchema";
import { paramsProductSchema } from "../schemas/product/paramsProductSchema";
import updateProductSchema from "../schemas/product/updateProductSchema";
import { AppDataSource } from "../server";

const router: Router = express.Router();

router.post(
  "/",
  validator(createProductSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Create a new product'
  */

    const { name, description, categoryId, groupId } = req.body;

    const productExists = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("UPPER(product.name) = UPPER(:name)", { name })
      .getOne();

    if (productExists) {
      return res.status(400).json({
        error: {
          name: "Product already exists",
        },
      });
    }

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id: categoryId })
      .getOne();

    if (!category) {
      return res.status(400).json({
        error: {
          categoryId: "Category not found",
        },
      });
    }

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id: groupId })
      .getOne();

    if (!group) {
      return res.status(400).json({
        error: {
          groupId: "Group not found",
        },
      });
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.status = true;
    product.category = category;
    product.group = group;

    await AppDataSource.manager.save(product);

    res.status(201).json(product);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get all products'
  */

  const products = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.group", "group")
    .select([
      "product.id",
      "product.name",
      "product.description",
      "product.status",
      "category.id",
      "category.description",
      "group.id",
      "group.description",
    ])
    .getMany();

  res.status(200).json(products);
});

router.get("/active", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get all active products'
  */

  const products = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.group", "group")
    .select([
      "product.id",
      "product.name",
      "product.description",
      "product.status",
      "category.id",
      "category.description",
      "group.id",
      "group.description",
    ])
    .where("product.status = :status", { status: true })
    .getMany();

  res.status(200).json(products);
});

router.get(
  "/:id",
  validator(paramsProductSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get a product by id'
  */
    const { id } = req.params;

    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.group", "group")
      .select([
        "product.id",
        "product.name",
        "product.description",
        "product.status",
        "category.id",
        "category.description",
        "group.id",
        "group.description",
      ])
      .where("product.id = :id", { id })
      .getOne();

    res.status(200).json(product);
  }
);

router.put(
  "/:id",
  validator(paramsProductSchema, "params"),
  validator(updateProductSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Update a product by id'
  */
    const { id } = req.params;

    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.group", "group")
      .select([
        "product.id",
        "product.name",
        "product.description",
        "product.status",
        "category.id",
        "category.description",
        "group.id",
        "group.description",
      ])
      .where("product.id = :id", { id })
      .getOne();

    if (!product)
      return res.status(400).json({
        error: {
          id: "Product not found",
        },
      });

    const { name, description, status, categoryId, groupId } = req.body;

    const productExists = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("UPPER(product.name) = UPPER(:name)", { name })
      .andWhere("product.id != :id", { id: product.id })
      .getOne();

    if (productExists) {
      return res.status(400).json({
        error: {
          name: "Product already exists",
        },
      });
    }

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id: categoryId })
      .getOne();

    if (!category) {
      return res.status(400).json({
        error: {
          categoryId: "Category not found",
        },
      });
    }

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id: groupId })
      .getOne();

    if (!group) {
      return res.status(400).json({
        error: {
          groupId: "Group not found",
        },
      });
    }

    await AppDataSource.manager.update(
      Product,
      { id: product.id },
      {
        name,
        description,
        status,
        category,
        group,
      }
    );

    res.status(200).json(product);
  }
);

router.delete(
  "/:id",
  validator(paramsProductSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Delete a product by id'
  */
    const { id } = req.params;

    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :id", { id })
      .getOne();

    if (!product)
      return res.status(400).json({
        error: {
          id: "Product not found",
        },
      });

    await AppDataSource.manager.delete(Product, { id: product.id });

    res.status(204).send();
  }
);

export default router;
