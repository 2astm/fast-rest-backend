import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../users/dto/sign-in.dto';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import { SignInByUniqueCodeDto } from '../users/dto/sign-in-by-unique-code.dto';
import { sign } from 'crypto';

@Controller('auth')
@ApiTags('authentication')
export class AuthenticationController {
  private logger = new Logger('AuthenticationController');

  constructor(private authService: AuthenticationService) {}

  @Post('sign-in')
  @ApiOkResponse({
    schema: { properties: { accessToken: { type: 'string' } } },
  })
  signIn(@Body() signIn: SignInDto) {
    this.logger.debug(`Sign-in: ${signIn.email}`);
    return this.authService.signIn(signIn);
  }

  @Post('sign-up')
  @ApiNotFoundResponse({ description: 'In case when invite not found' })
  signUp(@Body() signUp: SignUpDto) {
    this.logger.debug(`Sign-up: ${signUp.token}`);
    return this.authService.signUp(signUp);
  }

  @Post('sign-in-by-unique-code')
  @ApiOkResponse({
    schema: { properties: { accessToken: { type: 'string' } } },
  })
  @ApiNotFoundResponse({ description: "In case when unique code wasn't found" })
  signInByUniqueCode(@Body() signIn: SignInByUniqueCodeDto) {
    this.logger.debug(`Sign in by unique code: ${signIn.uniqueCode}`);
    return this.authService.signInByUniqueCode(signIn.uniqueCode);
  }

  @Get('get-unique-code')
  signUpPhone() {
    return this.authService.getUniqueCode();
  }
}
