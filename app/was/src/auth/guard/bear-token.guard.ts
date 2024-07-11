import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { TokensEnum } from '../const/tokens.const';
import { Request } from 'express';
import { StatusEnum } from '@/user/const/status.const';

@Injectable()
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
export class RegistedUserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const { id, email } = this.authService.verifyToken(token, false);
    const user = await this.usersService.getUserByEmail(email);

    if (user.status === StatusEnum.deactivated) {
      throw new ForbiddenException('잘못된 접근입니다.');
    }

    req.user = user;
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const { id, email } = this.authService.verifyToken(token, true);
    const user = await this.usersService.getUserByEmail(email);
    req.user = user;
    return true;
  }
}
