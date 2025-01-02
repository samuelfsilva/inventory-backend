import express, { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/category";
import validator from "../middleware/validator";
import createCategorySchema from "../schemas/category/createCategorySchema";
import {
  descriptionCategorySchema,
  paramsCategorySchema,
} from "../schemas/category/paramsCategorySchema";
import updateCategorySchema from "../schemas/category/updateCategorySchema";

const router: Router = express.Router();

router.post(
  "/",
  validator(createCategorySchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Create a category'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                example: 'Laticinios'
              },
              isActive: {
                type: 'boolean',
                example: true
              }
            }
          }
        }
      }
    }
  */

    const { description } = req.body;

    const categoryExists = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("UPPER(category.description) = UPPER(:description)", {
        description,
      })
      .getOne();

    if (categoryExists) {
      return res.status(400).json({
        error: {
          description: "Category already exists",
        },
      });
    }

    const category = new Category();
    category.description = description;
    category.isActive = true;

    await AppDataSource.manager.save(category);

    res.status(201).json(category);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all categories'
  */
  const categories = await AppDataSource.getRepository(Category)
    .createQueryBuilder("category")
    .getMany();

  res.status(200).json(categories);
});

router.get("/active", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all active categories'
  */
  const categories = await AppDataSource.getRepository(Category)
    .createQueryBuilder("category")
    .where("category.isActive = true")
    .getMany();

  res.status(200).json(categories);
});

router.get(
  "/:id",
  validator(paramsCategorySchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get a category by id'
  */
    const { id } = req.params;

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id })
      .getOne();

    res.status(200).json(category);
  }
);

router.get(
  "/description/:description",
  validator(descriptionCategorySchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get a category by description'
  */
    const { description } = req.params;

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.description = :description", {
        description,
      })
      .getOne();

    res.status(200).json(category);
  }
);

router.get(
  "/description-like/:description",
  validator(descriptionCategorySchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all categories with description like :description'
  */
    const { description } = req.params;

    const categories = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.description LIKE :description", {
        description: `%${description}%`,
      })
      .getMany();

    res.status(200).json(categories);
  }
);

router.get(
  "/:id/products",
  validator(paramsCategorySchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all products of a category'
  */

    const { id } = req.params;

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id })
      .leftJoinAndSelect("category.products", "products")
      .getOne();

    res.status(200).json(category);
  }
);

router.put(
  "/:id",
  validator(paramsCategorySchema, "params"),
  validator(updateCategorySchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Update a category'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                example: 'Laticinios'
              },
              isActive: {
                type: 'boolean',
                example: true
              }
            }
          }
        }
      }
    }
  */
    const { id } = req.params;

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id })
      .getOne();

    if (!category)
      return res.status(400).json({
        error: {
          id: "Category not found",
        },
      });

    const { description, isActive } = req.body;

    const categoryExist = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("UPPER(category.description) = UPPER(:description)", {
        description,
      })
      .andWhere("category.id != :id", { id: category.id })
      .getOne();

    if (categoryExist) {
      return res.status(400).json({
        error: {
          description: "Category already exists",
        },
      });
    }

    await AppDataSource.manager.update(
      Category,
      { id: category.id },
      {
        description,
        isActive,
      }
    );

    res.status(200).json(category);
  }
);

router.delete(
  "/:id",
  validator(paramsCategorySchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Delete a category'
  */
    const { id } = req.params;

    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.id = :id", { id })
      .getOne();

    if (!category)
      return res.status(400).json({
        error: {
          id: "Category not found",
        },
      });

    await AppDataSource.manager.delete(Category, { id: category.id });

    res.status(204).send();
  }
);

export default router;
