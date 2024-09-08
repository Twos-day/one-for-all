import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { Request } from 'express';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RefreshDto } from './dto/refresh.dto';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UserService,
  ) {}

  /** true일시 bearer 토큰 */
  extractTokenFromReq(req: Request, isBearer: boolean) {
    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new BadRequestException('토큰이 없습니다.');
    }

    const [type, token] = rawToken.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    const isValidate = type && token && prefix === type;

    if (!isValidate) {
      throw new BadRequestException('잘못된 토큰입니다.');
    }

    return token;
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!email || !password) {
      throw new BadRequestException('잘못된 토큰입니다.');
    }

    return { email, password };
  }

  async authenticateEmailUser(payload: { email: string; password: string }) {
    const existingUser = await this.userService.getUserByEmail(payload.email);

    if (!existingUser || existingUser.status === StatusEnum.unauthorized) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    if (existingUser.status === StatusEnum.deactivated) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    if (existingUser.accountType !== AccountType.email) {
      throw new NotFoundException('이메일로 회원가입된 계정이 아닙니다.');
    }

    const isPass = await bycrypt.compare(
      payload.password,
      existingUser.password,
    );

    if (!isPass) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    return existingUser;
  }

  /*
   * 토큰 복호화
   * true - refreshToken,
   * false - accessToken
   */
  verifyToken(token: string, isRefresh: boolean) {
    try {
      return this.jwrService.verify<RefreshDto>(token, {
        secret: isRefresh
          ? process.env.REFRESH_SECRET
          : process.env.ACCESS_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되거나 잘못되었습니다.');
    }
  }

  signRefreshToken(user: UserModel) {
    const payload: RefreshDto = {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
      avatar: user.avatar,
      nickname: user.nickname,
    };

    const refreshToken = this.jwrService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: 60 * 60 * 24 * 3, //초단위 3일
    });

    return refreshToken;
  }

  generateSessionDto(user: UserModel) {
    const session: SessionDto = {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      nickname: user.nickname,
      accountType: user.accountType,
      level: user.level,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken = this.jwrService.sign(session, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: 60 * 60, //초단위 1시간
    });

    return { ...session, accessToken };
  }
}
