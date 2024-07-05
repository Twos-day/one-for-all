import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bycrypt from 'bcrypt';
import { User } from '@/user/decorator/user.decorator';
import { UserModel } from '@/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SessionDto } from './dto/session.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bear-token.guard';
import { Request, Response } from 'express';
import { StatusEnum } from '@/user/const/status.const';
import { AccountType } from '@/user/const/account-type.const';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    const googleUser = req.user as {
      readonly email: string;
      readonly nickname: string;
      readonly picture: string;
      readonly accessToken: string;
    };

    let user = await this.userService.getUserByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.registerUser(
        {
          email: googleUser.email,
          nickname: googleUser.nickname,
          avatar: googleUser.picture,
        },
        AccountType.google,
      );
    }

    const redirectUrl: undefined | string = req.cookies.redirect;

    if (user.accountType !== AccountType.google) {
      const cause = '구글 계정으로 가입된 사용자가 아닙니다.';
      req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
      return;
    }

    if (user.status === StatusEnum.deactivated) {
      const cause = '접근할 수 없는 계정입니다.';
      req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
      return;
    }

    if (user.status === StatusEnum.activated) {
      const refreshToken = this.authService.createRefreshToken(user);

      req.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: this.configService.get('PROTOCAL') === 'https',
      });

      req.res.redirect(`${redirectUrl}`);
      return;
    }

    if (user.status === StatusEnum.unauthorized) {
      const refreshToken = this.authService.createRefreshToken(user);

      req.res.redirect(`${redirectUrl}/register?refreshToken=${refreshToken}`);
      return;
    }

    throw new InternalServerErrorException();
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req: Request) {}

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req: Request) {
    const kakaoUser = req.user as {
      readonly email: string;
      readonly nickname: string;
      readonly accessToken: string;
      readonly kakaoId: number;
      readonly picture: string;
    };

    let user = await this.userService.getUserByEmail(kakaoUser.email);

    if (!user) {
      user = await this.userService.registerUser(
        {
          email: kakaoUser.email,
          nickname: kakaoUser.nickname,
          avatar: kakaoUser.picture,
        },
        AccountType.kakao,
      );
    }

    const redirectUrl: string =
      req.cookies.redirect || process.env.PORTOCOL + '://' + process.env.HOST;

    if (user.accountType !== AccountType.kakao) {
      const cause = '카카오 계정으로 가입된 사용자가 아닙니다.';
      req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
      return;
    }

    if (user.status === StatusEnum.deactivated) {
      const cause = '접근할 수 없는 계정입니다.';
      req.res.redirect(
        `${redirectUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
      return;
    }

    if (user.status === StatusEnum.activated) {
      const refreshToken = this.authService.createRefreshToken(user);

      req.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: this.configService.get('PROTOCAL') === 'https',
      });

      req.res.redirect(`${redirectUrl}`);
      return;
    }

    if (user.status === StatusEnum.unauthorized) {
      const refreshToken = this.authService.createRefreshToken(user);

      req.res.redirect(`${redirectUrl}/register?refreshToken=${refreshToken}`);
      return;
    }

    throw new InternalServerErrorException();
  }

  @Post('register')
  /** 이메일 회원가입 - 1 */
  async postRegisterEmail(@Body() userDto: RegisterUserDto) {
    const result = await this.userService.registerUser(
      userDto,
      AccountType.email,
    );

    return { id: result.id, message: '이메일이 성공적으로 등록되었습니다.' };
  }

  @Post('verification/:id')
  /** 이메일 회원가입 인증번호 생성 - 2 */
  async postVerificationCode(@Param('id') id: string) {
    const { email, code } =
      await this.userService.generateVerificationCode(+id);

    await this.mailService.sendVerificationCode(email, code);

    Logger.log(`회원가입 이메일이 전송되었습니다. ${id} - ${email}`);

    return { message: '메일이 성공적으로 전송되었습니다.' };
  }

  @Post('register/:id')
  /** 이메일 회원가입 - 3 */
  async postNewUser(@Body() userDto: UpdateUserDto) {
    const hash = await bycrypt.hash(
      userDto.password,
      Number(this.configService.get<string>('HASH_ROUNDS')),
    );

    const { id } = await this.userService.updateNewUser({
      ...userDto,
      password: hash,
    });

    return { id, message: '회원정보가 성공적으로 등록되었습니다.' };
  }

  @UseGuards(BasicTokenGuard)
  @Post('email')
  /** 이메일 로그인 */
  async postLoginEmail(@User() user: UserModel, @Req() req: Request) {
    const refreshToken = this.authService.createRefreshToken(user);

    req.res.status(200);

    req.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('PROTOCAL') === 'https',
    });

    return { message: '로그인 되었습니다.' };
  }

  @Get('session')
  @ApiOperation({
    summary: '세션 조회',
    description: '리프레시 토큰을 이용하여 세션을 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '세션 조회 성공', type: SessionDto })
  @UseGuards(RefreshTokenGuard)
  async postSession(@User() user: UserModel) {
    const session = await this.authService.createSession(user);
    return session;
  }

  /** 유저정보 수정 */
  // @Patch(':id')
  // async patchUser(@Body() userDto: UpdateUserDto) {
  //   const result = await this.userService.updateUser(userDto);

  //   return { id: result.id, message: '회원정보가 성공적으로 수정되었습니다.' };
  // }

  /** 탈퇴 */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteUser(@User('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
