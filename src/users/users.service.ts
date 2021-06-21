import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { InvitesEntity } from './entities/invites.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { UserRolesEnum } from './enums/user-roles.enum';
import * as bcrypt from 'bcrypt';
import { genSalt } from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(InvitesEntity)
    private invitesRepository: Repository<InvitesEntity>,
  ) {}

  private static hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  findUserBy(conditions: {
    id?: number;
    email?: string;
    uuid?: string;
  }): Promise<UserEntity> {
    return this.usersRepository.findOneOrFail(conditions).catch((err) => {
      this.logger.error(`find user by: ${err}`);
      if (err.name == 'EntityNotFound')
        throw new NotFoundException('User not found');
      else throw new InternalServerErrorException();
    });
  }

  async createUser(signUp: SignUpDto) {
    const invite = await this.invitesRepository
      .findOneOrFail({
        id: signUp.token,
        expiredAt: Raw((alias) => `${alias} > now()`),
      })
      .catch((err) => {
        this.logger.error(`createUser: ${err}`);
        throw new NotFoundException('Invite not found');
      });
    const user = <UserEntity>{
      email: invite.email,
      name: invite.name,
      surname: invite.surname,
      role: UserRolesEnum.WORKER,
      salt: await genSalt(),
    };
    user.password = await UsersService.hashPassword(signUp.password, user.salt);
    invite.expiredAt = new Date(0);
    this.invitesRepository
      .save(invite)
      .catch((err) => this.logger.error(`create user error: ${err}`));
    return this.usersRepository.save(user);
  }

  async createUserByPhone() {
    const user = <UserEntity>{
      role: UserRolesEnum.USER,
    };
    return this.usersRepository.save(user);
  }
}
