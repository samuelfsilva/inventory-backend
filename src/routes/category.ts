import express, { Request, Response, Router } from "express";
import Joi from "joi";
import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/category";

const router: Router = express.Router();

const categorySchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  isActive: Joi.boolean().required(),
}).required();

const categoryParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post("/", async (req: Request, res: Response) => {
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

  const { error, value } = categorySchema.validate(req.body);

  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { description, isActive } = value;

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
  category.isActive = isActive;

  await AppDataSource.manager.save(category);

  res.status(201).json(category);
});

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

router.get("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get a category by id'
  */
  const { error: errorParams, value: valueParams } =
    categoryParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const category = await AppDataSource.getRepository(Category)
    .createQueryBuilder("category")
    .where("category.id = :id", { id })
    .getOne();

  res.status(200).json(category);
});

router.get("/description/:description", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get a category by description'
  */
  const category = await AppDataSource.getRepository(Category)
    .createQueryBuilder("category")
    .where("category.description = :description", {
      description: req.params.description,
    })
    .getOne();

  res.status(200).json(category);
});

router.get(
  "/description-like/:description",
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all categories with description like :description'
  */
    const categories = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.description LIKE :description", {
        description: `%${req.params.description}%`,
      })
      .getMany();

    res.status(200).json(categories);
  }
);

router.get("/:id/products", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all products of a category'
  */

  const { error: errorParams, value: valueParams } =
    categoryParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const category = await AppDataSource.getRepository(Category)
    .createQueryBuilder("category")
    .where("category.id = :id", { id })
    .leftJoinAndSelect("category.products", "products")
    .getOne();

  res.status(200).json(category);
});

router.put("/:id", async (req: Request, res: Response) => {
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
  const { error: errorParams, value: valueParams } =
    categoryParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

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

  const { error, value } = categorySchema.validate(req.body);

  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { description, isActive } = value;

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
});

router.delete("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Delete a category'
  */
  const { error: errorParams, value: valueParams } =
    categoryParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

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
});

export default router;
