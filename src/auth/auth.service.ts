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
  sub: number;
  email: string;
  type: TokensEnum;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const [type, token] = header.split(' ');
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

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
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

  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload: PayLoad = {
      sub: user.id,
      email: user.email,
      type: isRefreshToken ? TokensEnum.REFRESH : TokensEnum.ACCESS,
    };

    return this.jwrService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: isRefreshToken ? 3600 * 6 : 3600, //초단위
    });
  }

  verifyToken(token: string) {
    try {
      return this.jwrService.verify<PayLoad>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되거나 잘못되었습니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwrService.verify<PayLoad>(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
    });

    if (decoded.type !== TokensEnum.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }

    return this.signToken(
      { id: decoded.sub, email: decoded.email },
      isRefreshToken,
    );
  }

  //회원가입 후 바로 로그인
  async registerWithEmail(userDto: RegisterUserDto) {
    const hash = await bycrypt.hash(
      userDto.password,
      Number(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    );
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hash,
    });
    return this.loginUser(newUser);
  }

  //로그인
  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async getSessionUser(token: string) {
    const decoded = this.verifyToken(token);
    const user = await this.userService.getUserByEmail(decoded.email);

    const session = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken = this.jwrService.sign(session, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: 3600, //초단위
    });

    return { ...session, accessToken };
  }
}
