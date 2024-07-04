import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService as UserService } from 'src/user/user.service';
import { TokensEnum } from './const/tokens.const';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from './const/env-keys.const';

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

  extractTokenFromReq(req: any) {
    const rawToken: string | undefined = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const [type, token] = rawToken.split(' ');

    if (type === 'Bearer' && token) {
      return token;
    }

    throw new UnauthorizedException('잘못된 토큰입니다.');
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

  // async registerWithEmail(userDto: RegisterUserDto) {
  //   const hash = await bycrypt.hash(
  //     userDto.password,
  //     Number(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
  //   );

  //   const newUser = await this.userService.createUser({
  //     ...userDto,
  //     password: hash,
  //   });
  // }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    const refreshToken = this.jwrService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: 60 * 60 * 24 * 3, //초단위
    });

    return refreshToken;
  }

  async getSessionUser(token: string) {
    const decoded = this.verifyToken(token, true);
    const user = await this.userService.getUserByEmail(decoded.email);

    const session: Session = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
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
