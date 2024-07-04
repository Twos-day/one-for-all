import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { TokensEnum } from '../const/tokens.const';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromReq(req, true);
    const { id, email } = this.authService.verifyToken(token, false);
    const user = await this.usersService.getUserById(id);
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
    const user = await this.usersService.getUserById(id);
    req.user = user;
    return true;
  }
}
