import Joi from "joi";

const paramsBatchSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Id",
    })
    .required(),
});

export default paramsBatchSchema;
