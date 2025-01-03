import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().max(250).allow("").optional(),
  categoryId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Category Id",
    })
    .required(),
  groupId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Group Id",
    })
    .required(),
});

export default createProductSchema;
