import Joi from 'joi';

export const envSchema = Joi.object({
  DB_HOST: Joi.string().default(5432).required(),
  DB_PORT: Joi.number().default(3000).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
