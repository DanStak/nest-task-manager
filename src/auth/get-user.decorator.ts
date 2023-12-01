import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUser } from './auth-user.interface';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
