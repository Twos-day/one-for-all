import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

import { StatusEnum } from '@/user/const/status.const';

@Injectable()
/** 활성화된 계정인지 체크 */
export class ActivatedUserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const { id, email } = this.authService.verifyToken(token, false);
    const user = await this.usersService.getUserByEmail(email);

    if (user.status !== StatusEnum.activated) {
      throw new ForbiddenException('활성화 되지않은 계정입니다.');
    }

    req.user = user;
    return true;
  }
}

@Injectable()
/** 등록된 계정인지 체크 */
export class SignupUserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const payload = this.authService.verifyToken(token, true);
    const user = await this.usersService.getUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('가입되지 않은 사용자입니다.');
    }

    if (user.status === StatusEnum.deactivated) {
      throw new ForbiddenException('접근이 제한된 사용자입니다.');
    }

    if (!payload.accountType) {
      throw new BadRequestException('회원가입 계정정보가 부족합니다.');
    }

    user.accountType = payload.accountType;
    user.avatar = payload.avatar;
    user.nickname = payload.nickname;
    req.user = user;

    return true;
  }
}
