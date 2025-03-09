import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validator = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property]);
    if (error) {
      const { path, message } = error.details[0];
      return res.status(400).json({
        error: {
          [path.toString()]: message,
        },
      });
    }
    if (property === "params") req.params = value;
    if (property === "query") req.query = value;
    if (property === "body") req.body = value;
    next();
  };
};

export default validator;
