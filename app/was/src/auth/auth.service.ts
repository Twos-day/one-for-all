import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { excuteRootDomain } from './util/excute-root-domain';
import { getServerUrl } from '@/common/util/getServerUrl';

type PayLoad = {
  id: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromReq(req: Request, isBearer: boolean) {
    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const [type, token] = rawToken.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    const isValidate = type && token && prefix === type;

    if (!isValidate) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return token;
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!email || !password) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return { email, password };
  }

  veryfySocialUser(
    req: Request,
    user: UserModel,
    accountType: AccountType,
  ): void {
    const redirectUrl: string = req.cookies.redirect || getServerUrl();

    if (user.accountType && user.accountType !== accountType) {
      const cause = `${accountType.toUpperCase()} 계정으로 가입된 사용자가 아닙니다.`;
      return req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status === StatusEnum.deactivated) {
      const cause = '접근할 수 없는 계정입니다.';
      return req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status === StatusEnum.unauthorized) {
      // 추가 정보 입력
      const token = this.createRefreshToken(user);
      return req.res.redirect(`${redirectUrl}/signup/register?token=${token}`);
    }

    if (
      user.accountType === accountType &&
      user.status === StatusEnum.activated
    ) {
      // 로그인 처리
      const refreshToken = this.createRefreshToken(user);
      this.setRefreshCookie(req.res, refreshToken);
      return req.res.redirect(`${redirectUrl}`);
    }

    throw new InternalServerErrorException('관리자에게 문의하세요.');
  }

  verifyEmailUser(req: Request, user: UserModel): void {
    const redirectUrl: string = req.cookies.redirect || getServerUrl();

    if (user.accountType && user.accountType !== AccountType.email) {
      const cause = '이메일 계정으로 가입된 사용자가 아닙니다.';
      return req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status === StatusEnum.deactivated) {
      const cause = '접근할 수 없는 계정입니다.';
      return req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status !== StatusEnum.unauthorized) {
      throw new BadRequestException('이미 가입된 사용자입니다.');
    }
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser || existingUser.status === StatusEnum.unauthorized) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    if (existingUser.status === StatusEnum.deactivated) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    const isPass = await bycrypt.compare(user.password, existingUser.password);

    if (!isPass) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

  verifyToken(token: string, isRefresh: boolean) {
    try {
      return this.jwrService.verify<PayLoad>(token, {
        secret: this.configService.get(
          isRefresh ? 'REFRESH_SECRET' : 'ACCESS_SECRET',
        ),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되거나 잘못되었습니다.');
    }
  }

  createRefreshToken(user: UserModel) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const refreshToken = this.jwrService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: 60 * 60 * 24 * 3, //초단위
    });

    return refreshToken;
  }

  setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      domain: excuteRootDomain(process.env.HOST),
      secure: process.env.PROTOCOL === 'https',
    });
  }

  createSession(user: UserModel) {
    const session: Session = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      accountType: user.accountType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken = this.jwrService.sign(session, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: 60 * 60, //초단위
    });

    return { ...session, accessToken };
  }
}
