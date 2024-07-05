import { AccountType } from '@/user/const/account-type.const';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

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

  extractTokenFromReq(req: any, isBearer: boolean) {
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

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
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

  async createSession(user: UserModel) {
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
