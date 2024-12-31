import Joi from "joi";

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(150).required(),
  lastName: Joi.string().trim().min(1).max(150).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "The password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces",
      "string.pattern.alphanum":
        "The password must contain at least one letter",
      "string.pattern.num": "The password must contain at least one number",
      "string.pattern.special":
        "The password must contain at least one special character",
      "string.pattern.noSpaces": "The password must not contain spaces",
      "string.max": "The password must contain at most 30 characters",
    })
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s)[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    ),
});

export default updateUserSchema;
