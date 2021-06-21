import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from "./dto/sign-up.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

}
