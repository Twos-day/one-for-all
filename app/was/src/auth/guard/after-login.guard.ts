import { StatusEnum } from '@/user/const/status.const';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
/** Only Logined User */
export class AccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const payload = this.authService.verifyToken(token, false);
    const user = await this.usersService.getUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.status !== StatusEnum.activated) {
      throw new ForbiddenException('활성화 되지않은 계정입니다.');
    }

    req.user = user;
    return true;
  }
}

@Injectable()
/** Before Signed up User */
export class SessoionUserGuard implements CanActivate {
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

    if (user.status !== StatusEnum.activated) {
      throw new ForbiddenException('비정상적인 접근입니다.');
    }

    req.user = user;
    return true;
  }
}
