import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserPayload } from '../common/types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUserPayload => {
    return ctx.switchToHttp().getRequest().user;
  },
);
