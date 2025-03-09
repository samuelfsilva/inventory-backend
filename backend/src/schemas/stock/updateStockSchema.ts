import Joi from "joi";

const updateStockSchema = Joi.object({
  quantity: Joi.number().min(0).required(),
  depositId: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Deposit Id",
    })
    .required(),
  batchId: Joi.string().trim().uuid().messages({
    "string.guid": "Invalid Batch Id",
  }),
});

export default updateStockSchema;
