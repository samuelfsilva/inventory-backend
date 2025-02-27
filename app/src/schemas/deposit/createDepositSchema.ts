import Joi from "joi";

const createDepositSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250).required(),
  description: Joi.string().trim().max(250).allow("").optional(),
});

export default createDepositSchema;
