import { UserRolesEnum } from '../../users/enums/user-roles.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Auth = (...roles: UserRolesEnum[]) => {
  const args: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    UseGuards(JwtAuthGuard),
  ];
  if (roles.length > 0) {
    args[0] = UseGuards(JwtAuthGuard, RolesGuard);
    args.push(SetMetadata('roles', roles));
    roles.forEach((value) => {
      args.push(ApiBearerAuth(value));
    });
  } else {
    Object.keys(UserRolesEnum).forEach((value) =>
      args.push(ApiBearerAuth(value)),
    );
  }
  return applyDecorators.apply(applyDecorators(), args);
};
