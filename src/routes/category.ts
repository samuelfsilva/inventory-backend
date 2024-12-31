import express, { Request, Response, Router } from "express";
import Joi from "joi";
import { AppDataSource } from "../database/data-source";
import { Categories } from "../entities/categories";

const router: Router = express.Router();

const categoriesSchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  isActive: Joi.boolean().required(),
}).required();

const categoriesParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

router.post("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
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

  const { error, value } = categoriesSchema.validate(req.body);

  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { description, isActive } = value;

  const category = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("UPPER(categories.description) = UPPER(:description)", {
      description,
    })
    .getOne();

  if (category) {
    return res.status(400).json({
      error: {
        description: "Category already exists",
      },
    });
  }

  const categories = new Categories();
  categories.description = description;
  categories.isActive = isActive;

  await AppDataSource.manager.save(categories);

  res.status(201).json(categories);
});

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all categories'
  */
  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .getMany();

  res.status(200).json(categories);
});

router.get("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get a category by id'
  */
  const { error: errorParams, value: valueParams } =
    categoriesParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id })
    .getOne();

  res.status(200).json(categories);
});

router.get("/description/:description", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get a category by description'
  */
  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.description = :description", {
      description: req.params.description,
    })
    .getOne();

  res.status(200).json(categories);
});

router.get(
  "/description-like/:description",
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all categories with description like :description'
  */
    const categories = await AppDataSource.getRepository(Categories)
      .createQueryBuilder("categories")
      .where("categories.description LIKE :description", {
        description: `%${req.params.description}%`,
      })
      .getMany();

    res.status(200).json(categories);
  }
);

router.get("/:id/products", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Get all products of a category'
  */

  const { error: errorParams, value: valueParams } =
    categoriesParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id })
    .leftJoinAndSelect("categories.products", "products")
    .getOne();

  res.status(200).json(categories);
});

router.put("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
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
    categoriesParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id })
    .getOne();

  if (!categories)
    return res.status(400).json({
      error: {
        id: "Categories not found",
      },
    });

  const { error, value } = categoriesSchema.validate(req.body);

  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { description, isActive } = value;

  const categoryExist = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("UPPER(categories.description) = UPPER(:description)", {
      description,
    })
    .andWhere("categories.id != :id", { id: categories.id })
    .getOne();

  if (categoryExist) {
    return res.status(400).json({
      error: {
        description: "Category already exists",
      },
    });
  }

  await AppDataSource.manager.update(
    Categories,
    { id: categories.id },
    {
      description,
      isActive,
    }
  );

  res.status(200).json(categories);
});

router.delete("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Categories']
    #swagger.description = 'Delete a category'
  */
  const { error: errorParams, value: valueParams } =
    categoriesParamsSchema.validate(req.params);

  if (errorParams) {
    const { path, message } = errorParams.details[0];
    return res.status(400).json({
      error: {
        [path.toString()]: message,
      },
    });
  }

  const { id } = valueParams;

  const categories = await AppDataSource.getRepository(Categories)
    .createQueryBuilder("categories")
    .where("categories.id = :id", { id })
    .getOne();

  if (!categories)
    return res.status(400).json({
      error: {
        id: "Categories not found",
      },
    });

  await AppDataSource.manager.delete(Categories, { id: categories.id });

  res.status(204).send();
});

export default router;
