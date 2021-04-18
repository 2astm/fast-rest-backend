import * as Joi from 'joi';
export default {
  schema: Joi.object({
    PORT: Joi.number().integer().default(3000).failover(3000),
    MODE: Joi.string()
      .valid('development', 'production')
      .default('development'),
    SQL_LOGS: Joi.boolean().default(false),
  }),
};
