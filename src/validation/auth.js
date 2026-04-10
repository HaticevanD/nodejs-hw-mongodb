import Joi from 'joi';

// Rules for Register
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Rules for Login
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

//Rules for Request Email
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

//Rules for Reset Email
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
