import Joi from "joi";

const updateCategorySchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  isActive: Joi.boolean().required(),
});

export default updateCategorySchema;
