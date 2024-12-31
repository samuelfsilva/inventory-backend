import Joi from "joi";

const createCategorySchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
});

export default createCategorySchema;
