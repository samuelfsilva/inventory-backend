import Joi from "joi";

export const paramsProductSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Id",
    })
    .required(),
});
