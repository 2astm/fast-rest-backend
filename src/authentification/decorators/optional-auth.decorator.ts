import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../guards/optional-auth.guard';

export const OptionalAuth = () => {
  const args: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    UseGuards(OptionalJwtAuthGuard),
  ];
  return applyDecorators.apply(applyDecorators, args);
};
