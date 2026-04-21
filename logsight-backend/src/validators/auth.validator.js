import Joi from "joi";

// 🔐 REGISTER SCHEMA (STRONG PASSWORD)
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must contain at least 1 letter and 1 number",
      "any.required": "Password is required",
    }),
}).unknown(false);

// 🔐 LOGIN SCHEMA
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
}).unknown(false);

// 🔐 FORGOT PASSWORD SCHEMA
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
}).unknown(false);

// 🔐 RESET PASSWORD SCHEMA
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      "string.length": "Reset code must be exactly 6 digits",
      "any.required": "Reset code is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must contain at least 1 letter and 1 number",
      "any.required": "New password is required",
    }),
}).unknown(false);