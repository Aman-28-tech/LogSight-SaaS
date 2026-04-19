import Joi from "joi";

export const logSchema = Joi.object({
  service: Joi.string().trim().required(),

  level: Joi.string()
    .valid("info", "error", "warning")
    .required(),

  message: Joi.string().trim().required(),
}).unknown(false);