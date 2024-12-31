import Joi from "joi";

const updateMovementSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid User Id",
    })
    .required(),
  movementDate: Joi.date().max("now").required(),
  isActive: Joi.boolean().required(),
});

export default updateMovementSchema;
