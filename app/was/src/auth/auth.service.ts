import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import {
  BadRequestException,
  ForbiddenException,
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
import { SessionDto } from './dto/session.dto';
import { SocialUserDto } from './dto/social-user.dto';

type Payload = {
  id: number;
  email: string;
  accountType: AccountType;
  avatar?: string;
  nickname?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
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

  async veryfySocialUser(
    req: Request,
    socialUser: SocialUserDto,
    accountType: AccountType,
  ): Promise<void> {
    let user = await this.userService.getUserByEmail(socialUser.email);

    if (!user) {
      // 유저가 없으면 새로 생성
      user = await this.userService.registerUser(socialUser);
    }
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
      // 토큰에 dto 추가
      user.accountType = accountType;
      user.avatar = socialUser.avatar;
      user.nickname = socialUser.nickname;
      const token = this.generateRefreshToken(user);
      return req.res.redirect(`${redirectUrl}/signup/register?token=${token}`);
    }

    if (
      user.accountType === accountType &&
      user.status === StatusEnum.activated
    ) {
      // 로그인 처리
      const refreshToken = this.generateRefreshToken(user);
      this.setRefreshToken(req.res, refreshToken);
      return req.res.redirect(`${redirectUrl}`);
    }

    throw new InternalServerErrorException('관리자에게 문의하세요.');
  }

  verifyEmailUser(req: Request, user: UserModel): void {
    const redirectUrl: string = req.cookies.redirect || getServerUrl();

    if (user.accountType && user.accountType !== AccountType.email) {
      const cause = '이메일 계정으로 가입된 사용자가 아닙니다.';
      throw new UnauthorizedException(cause);
    }

    if (user.status === StatusEnum.deactivated) {
      const cause = '접근할 수 없는 계정입니다.';
      throw new UnauthorizedException(cause);
    }

    if (user.status !== StatusEnum.unauthorized) {
      throw new UnauthorizedException('이미 가입된 사용자입니다.');
    }
  }

  async authenticateWithEmailAndPassword(payload: {
    email: string;
    password: string;
  }) {
    const existingUser = await this.userService.getUserByEmail(payload.email);

    if (!existingUser || existingUser.status === StatusEnum.unauthorized) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    if (existingUser.status === StatusEnum.deactivated) {
      throw new ForbiddenException('비활성화된 계정입니다.');
    }

    if (existingUser.accountType !== AccountType.email) {
      throw new ForbiddenException('이메일로 회원가입된 계정이 아닙니다.');
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

  /** true일시 refreshToken */
  verifyToken(token: string, isRefresh: boolean) {
    try {
      return this.jwrService.verify<Payload>(token, {
        secret: isRefresh
          ? process.env.REFRESH_SECRET
          : process.env.ACCESS_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되거나 잘못되었습니다.');
    }
  }

  generateRefreshToken(user: UserModel) {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
      avatar: user.avatar,
      nickname: user.nickname,
    };

    const refreshToken = this.jwrService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: 60 * 60 * 24 * 3, //초단위
    });

    return refreshToken;
  }

  setRefreshToken(res: Response, token: string) {
    res.cookie('', token, {
      httpOnly: true,
      domain: excuteRootDomain(process.env.HOST),
      secure: process.env.PROTOCOL === 'https',
    });
  }

  createSession(user: UserModel) {
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
      expiresIn: 60 * 60, //초단위
    });

    return { ...session, accessToken };
  }
}
