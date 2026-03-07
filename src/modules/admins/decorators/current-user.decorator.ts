import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/modules/users/schemas/user.schema';

export type CurrentUserType = {
  id: string;
  role: UserRole;
};

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserType = request.user;
    return user;
  },
);
