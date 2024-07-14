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
/** Guest or Logined User */
export class PublicUserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization === undefined) {
      return true;
    }

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
  }
}

@Injectable()
/** Only Logined User */
export class ActivatedUserGuard implements CanActivate {
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

    if (user.status !== StatusEnum.unauthorized) {
      throw new ForbiddenException('비정상적인 접근입니다.');
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
