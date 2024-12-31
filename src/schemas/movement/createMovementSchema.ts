import Joi from "joi";

const createMovementSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid User Id",
    })
    .required(),
  movementDate: Joi.date().max("now").required(),
});

export default createMovementSchema;
