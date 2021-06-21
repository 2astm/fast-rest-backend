import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from '../users/dto/sign-in.dto';
import { UserEntity } from '../users/entities/user.entity';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { sign } from 'crypto';

@Injectable()
export class AuthenticationService {
  private logger = new Logger('AuthenticationService');

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    this.logger.debug(`validate user: ${email}`);
    const user = await this.userService.findUserBy({ email });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
  }

  async signIn(signIn: SignInDto) {
    this.logger.debug(`sign-in: ${signIn.email}`);
    const user = await this.validateUser(signIn.email, signIn.password);
    return {
      accessToken: await this.generateToken(user),
    };
  }

  async signUp(signUp: SignUpDto) {
    this.logger.debug(`sign-up: ${signUp.token}`);
    await this.userService.createUser(signUp);
    return 'User successfully created';
  }

  private async generateToken(user: UserEntity) {
    const payload: JwtPayload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async getUniqueCode() {
    return { userUUID: (await this.userService.createUserByPhone()).uuid };
  }

  async signInByUniqueCode(uniqueCode: string) {
    this.logger.debug(`signInByUniqueCode: ${uniqueCode}`);
    const user = await this.userService.findUserBy({ uuid: uniqueCode });
    return { accessToken: await this.generateToken(user) };
  }
}
