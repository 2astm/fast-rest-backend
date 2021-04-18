// import { ConfigService } from '@nestjs/config';
// import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
//
// class TypeOrmConfiguration {
//   constructor(private configService: ConfigService) {}
//
//   public getTypeOrmConfig(): PostgresConnectionOptions {
//     // return {
//     //   type: 'postgres',
//     //   host: ,
//     //   port: parseInt(this.getValue('DB_PORT'), 10),
//     //   username: this.getValue('DB_USERNAME'),
//     //   password: this.getValue('DB_PASSWORD'),
//     //   database: this.getValue('DB_NAME'),
//     //   entities: ['dist/**/*.entity{.ts,.js}'],
//     //   synchronize: this.getValue('DB_SYNCHRONIZE') === 'true',
//     //
//     //   migrationsTableName: 'migrations',
//     //
//     //   migrations: ['dist/src/migrations/*.js'],
//     //
//     //   cli: {
//     //     migrationsDir: 'src/migrations',
//     //   },
//     //
//     //   ssl: this.isProduction(),
//     //   logging: true,
//     // };
//     return null;
//   }
// }
