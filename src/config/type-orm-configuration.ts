import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './config.enum';

export default (configService: ConfigService): TypeOrmModuleOptions => ({
  name: 'default',
  type: 'postgres',
  host: configService.get(ConfigEnum.PG_HOST),
  port: configService.get(ConfigEnum.PG_PORT),
  username: configService.get(ConfigEnum.PG_USERNAME),
  password: configService.get(ConfigEnum.PG_PASSWORD),
  database: configService.get(ConfigEnum.PG_DATABASE_NAME),
  logging: configService.get(ConfigEnum.DATABASE_LOGS),
  entities: ['dist/**/*.{entity,view}.{js, ts}'],
  synchronize: configService.get(ConfigEnum.DATABASE_SYNC),
  migrationsRun: false,
  useUTC: true,
});
