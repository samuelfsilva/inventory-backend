import Joi from "joi";

const updateMovementItemSchema = Joi.object({
  details: Joi.string().trim().min(1).max(250).optional(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  movementId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Movement Id",
    })
    .required(),
  productId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Product Id",
    })
    .required(),
});

export default updateMovementItemSchema;
