import { UserRolesEnum } from '../../users/enums/user-roles.enum';

export interface JwtPayload {
  id: number;
  role: UserRolesEnum;
}