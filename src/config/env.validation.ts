import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

  PORT: Joi.number().port().default(3000),

  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().port().default(5432),

  DB_USERNAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().required(),

  DB_DATABASE: Joi.string().required(),

  DB_SSL: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().min(8).required(),

  JWT_EXPIRES_IN: Joi.string().default('1h'),

  AUTH_DEFAULT_EMAIL: Joi.string().email().default('admin@surf.com'),

  AUTH_DEFAULT_PASSWORD: Joi.string().min(8).default('admin123'),

  AWS_REGION: Joi.string().default('sa-east-1'),

  S3_BUCKET_NAME: Joi.string().required(),
});
