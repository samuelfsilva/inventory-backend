import express, { Request, Response, Router } from "express";
import { Group } from "../entities/group";
import validator from "../middleware/validator";
import createGroupSchema from "../schemas/group/createGroupSchema";
import {
  descriptionGroupSchema,
  paramsGroupSchema,
} from "../schemas/group/paramsGroupSchema";
import updateGroupSchema from "../schemas/group/updateGroupSchema";
import { AppDataSource } from "../server";

const router: Router = express.Router();

router.post(
  "/",
  validator(createGroupSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Create a new group'
  */
    const { description } = req.body;

    const groupExists = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("UPPER(group.description) = UPPER(:description)", { description })
      .getOne();

    if (groupExists) {
      return res.status(400).json({
        error: {
          description: "Group already exists",
        },
      });
    }

    const group = new Group();
    group.description = description;

    await AppDataSource.manager.save(group);

    res.status(201).json(group);
  }
);

router.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get all groups'
  */
  const groups = await AppDataSource.getRepository(Group)
    .createQueryBuilder("group")
    .getMany();

  res.status(200).json(groups);
});

router.get(
  "/:id/products",
  validator(paramsGroupSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get all products from a group'
  */

    const { id } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id })
      .leftJoinAndSelect("group.products", "product")
      .getMany();

    res.status(200).json(group);
  }
);

router.get(
  "/:id",
  validator(paramsGroupSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group'
  */

    const { id } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id })
      .getOne();

    res.status(200).json(group);
  }
);

router.get(
  "/description/:description",
  validator(descriptionGroupSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group by description'
  */
    const { description } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.description = :description", {
        description,
      })
      .getOne();

    res.status(200).json(group);
  }
);

router.get(
  "/description-like/:description",
  validator(descriptionGroupSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Get a group by description like'
  */
    const { description } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.description LIKE :description", {
        description: `%${description}%`,
      })
      .getOne();

    res.status(200).json(group);
  }
);

router.put(
  "/:id",
  validator(paramsGroupSchema, "params"),
  validator(updateGroupSchema, "body"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Update a group'
  */

    const { id } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id })
      .getOne();

    if (!group)
      return res.status(400).json({
        error: {
          id: "Group not found",
        },
      });

    const { description } = req.body;

    const groupExists = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("UPPER(group.description) = UPPER(:description)", { description })
      .andWhere("group.id != :id", { id: group.id })
      .getOne();

    if (groupExists) {
      return res.status(400).json({
        error: {
          description: "Group already exists",
        },
      });
    }

    await AppDataSource.manager.update(
      Group,
      { id: group.id },
      {
        description,
      }
    );

    res.status(200).json(group);
  }
);

router.delete(
  "/:id",
  validator(paramsGroupSchema, "params"),
  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Group']
    #swagger.description = 'Delete a group'
  */

    const { id } = req.params;

    const group = await AppDataSource.getRepository(Group)
      .createQueryBuilder("group")
      .where("group.id = :id", { id })
      .getOne();

    if (!group)
      return res.status(400).json({
        error: {
          id: "Group not found",
        },
      });

    await AppDataSource.manager.delete(Group, { id: group.id });

    res.status(204).send();
  }
);

export default router;
