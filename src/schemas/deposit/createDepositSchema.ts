import Joi from "joi";

const createDepositSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().min(1).max(250).optional(),
});

export default createDepositSchema;
