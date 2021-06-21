import * as Joi from 'joi';

const msRegex = new RegExp(
  '^(-?(?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$',
);

export default {
  schema: Joi.object({
    PORT: Joi.number().integer().default(3000).failover(3000),
    MODE: Joi.string()
      .valid('development', 'production')
      .failover('development')
      .default('development'),
    SQL_LOGS: Joi.boolean().default(false).failover(false),
    PG_HOST: Joi.string().required(),
    PG_PORT: Joi.number().greater(0).required(),
    PG_USERNAME: Joi.string().required(),
    PG_PASSWORD: Joi.string().required(),
    PG_DATABASE_NAME: Joi.string().required(),
    DATABASE_LOGS: Joi.boolean().default(false).failover(false),
    DATABASE_SYNC: Joi.boolean().default(false).failover(false),
    JWT_SECRET: Joi.string().required(),
    JWT_RESTORE_SECRET: Joi.string().required(),
    JWT_RESTORE_EXPIRES_IN: Joi.string()
      .regex(msRegex)
      .default('1h')
      .failover('1h'),
    JWT_EXPIRES_IN: Joi.string().regex(msRegex).default('1h').failover('1h'),
  }),
};
