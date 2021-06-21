import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../config/config.enum';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ConfigEnum.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(ConfigEnum.JWT_EXPIRES_IN),
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [JwtModule, JwtStrategy, PassportModule, AuthenticationService],
})
export class AuthenticationModule {}
