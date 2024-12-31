import Joi from "joi";

export const paramsCategorySchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Id",
    })
    .required(),
});

export const descriptionCategorySchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
});
