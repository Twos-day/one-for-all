import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UserModel } from '../entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user: UserModel = req.user;

    if (!user) {
      throw new InternalServerErrorException('사용자 정보가 없습니다.');
    }

    return data ? user[data] : user;
  },
);
