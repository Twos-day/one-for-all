import { StatusEnum } from '@/user/const/status.const';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /** 통과할 수 있는지 없는지에 대한 함수 */
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = this.authService.extractTokenFromReq(req, false);

    const payload = this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateEmailUser(payload);

    req.user = user;

    return true;
  }
}

@Injectable()
/** Before Signed up User */
export class SignupSessionGuard implements CanActivate {
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

    //프론트에 payload에 담긴 정보를 session으로 전달
    user.accountType = payload.accountType;
    user.avatar = payload.avatar;
    user.nickname = payload.nickname;
    req.user = user;
    return true;
  }
}

@Injectable()
/** Guest or Logined User */
export class SignupAccessGuard implements CanActivate {
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
      throw new NotFoundException('가입되지 않은 사용자입니다.');
    }

    if (user.status !== StatusEnum.unauthorized) {
      throw new ForbiddenException('비정상적인 접근입니다.');
    }

    //payload에 담긴 정보를 user로 전달
    user.accountType = payload.accountType;
    req.user = user;
    return true;
  }
}

@Injectable()
/** Guest or Logined User */
export class PublicAccessGuard implements CanActivate {
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
