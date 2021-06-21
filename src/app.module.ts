import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfiguration from './config/type-orm-configuration';
import { AuthenticationModule } from './authentification/authentication.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configuration.schema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfiguration,
    }),
    UsersModule,
    AuthenticationModule,
    RestaurantsModule,
    ItemsModule,
  ],
})
export class AppModule {}
