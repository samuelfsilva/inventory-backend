import Joi from "joi";

const updateCategorySchema = Joi.object({
  description: Joi.string().trim().min(1).max(250).required(),
  status: Joi.boolean().required(),
});

export default updateCategorySchema;
