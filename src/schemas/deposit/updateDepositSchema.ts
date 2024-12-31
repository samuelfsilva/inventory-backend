import Joi from "joi";

const updateDepositSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().min(1).max(250).optional(),
});

export default updateDepositSchema;
