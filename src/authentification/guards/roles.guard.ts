import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  Logger
} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRolesEnum } from '../../users/enums/user-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger('RolesGuard');

  constructor(private reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRolesEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) return false;
    if (roles.includes(user.role)) return true;
    this.logger.error(
      `User cannot access, user role: ${user.role}, allowed: ${JSON.stringify(
        roles,
      )}`,
    );
    throw new ForbiddenException(`Only ${roles} have access`);
  }
}
