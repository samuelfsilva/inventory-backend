import Joi from "joi";

export const paramsUserSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Id",
    })
    .required(),
});

export const firstNameUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(150).required(),
});
