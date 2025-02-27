import Joi from "joi";

export const paramsMovementSchema = Joi.object({
  id: Joi.string()
    .trim()
    .uuid()
    .messages({
      "string.guid": "Invalid Id",
    })
    .required(),
});

export const movementPeriodSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required().messages({
    "date.min": 'The end date must be greater than or equal to start date"',
  }),
});

export const movementDateSchema = Joi.object({
  movementDate: Joi.date().required(),
});
