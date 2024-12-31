import Joi from "joi";

const createBatchSchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  expirationDate: Joi.date().min("now").required(),
  productId: Joi.string()
    .uuid()
    .messages({
      "string.uuid": "Invalid Product Id",
    })
    .required(),
});

export default createBatchSchema;
