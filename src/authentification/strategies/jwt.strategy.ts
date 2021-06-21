import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../config/config.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');

  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ConfigEnum.JWT_SECRET),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    this.logger.debug('validate');
    const { id } = payload;
    const user = await this.userService.findUserBy({ id });

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
