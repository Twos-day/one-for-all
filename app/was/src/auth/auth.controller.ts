import { getServerUrl } from '@/common/util/getServerUrl';
import { MailService } from '@/mail/mail.service';
import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import { User } from '@/user/decorator/user.decorator';
import { UserModel } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bycrypt from 'bcrypt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleUser } from './decorator/google-user.decorator';
import { KakaoUser } from './decorator/kakao-user.decorator';
import { EmailUserDto } from './dto/email-user.dto';
import { SessionDto } from './dto/session.dto';
import { SocialUserDto } from './dto/social-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import {
  ActivatedUserGuard,
  RefreshTokenGuard,
  RegistedUserGuard,
} from './guard/bear-token.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @GoogleUser() googleUser: SocialUserDto,
    @Req() req: Request,
  ) {
    let user = await this.userService.getUserByEmail(googleUser.email);

    if (!user) {
      // 유저가 없으면 새로 생성
      user = await this.userService.registerUser(googleUser);
    }

    const redirectUrl: string = req.cookies.redirect || getServerUrl();

    if (user.accountType && user.accountType !== AccountType.google) {
      const cause = '구글 계정으로 가입된 사용자가 아닙니다.';
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
      const token = this.authService.createRefreshToken(user);
      return req.res.redirect(`${redirectUrl}/signup/register?token=${token}`);
    }

    if (
      user.accountType === AccountType.google &&
      user.status === StatusEnum.activated
    ) {
      // 로그인 처리
      const refreshToken = this.authService.createRefreshToken(user);
      this.authService.setRefreshCookie(req.res, refreshToken);
      return req.res.redirect(`${redirectUrl}`);
    }

    throw new InternalServerErrorException('관리자에게 문의하세요.');
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(
    @KakaoUser() kakaoUser: SocialUserDto,
    @Req() req: Request,
  ) {
    let user = await this.userService.getUserByEmail(kakaoUser.email);

    if (!user) {
      // 유저가 없으면 새로 생성
      user = await this.userService.registerUser(kakaoUser);
    }

    const redirectUrl: string = req.cookies.redirect || getServerUrl();

    if (user.accountType && user.accountType !== AccountType.kakao) {
      const cause = '카카오 계정으로 가입된 사용자가 아닙니다.';
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
      const token = this.authService.createRefreshToken(user);
      return req.res.redirect(`${redirectUrl}/signup/register?token=${token}`);
    }

    if (
      user.accountType === AccountType.kakao &&
      user.status === StatusEnum.activated
    ) {
      // 로그인 처리
      const refreshToken = this.authService.createRefreshToken(user);
      this.authService.setRefreshCookie(req.res, refreshToken);
      return req.res.redirect(`${redirectUrl}`);
    }

    throw new InternalServerErrorException('관리자에게 문의하세요.');
  }

  @Post('register')
  async postRegisterEmail(
    @Body() emailUser: EmailUserDto,
    @Req() req: Request,
  ) {
    let user = await this.userService.getUserByEmail(emailUser.email);

    if (!user) {
      // 유저가 없으면 새로생성
      user = await this.userService.registerUser(emailUser);
    }

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

    const token = this.authService.createRefreshToken(user);
    return { data: { token }, message: ['사용자정보 추가등록을 진행합니다.'] };
  }

  @UseGuards(RegistedUserGuard)
  @Post('verification')
  /** 이메일 회원가입 인증번호 생성 - 2 */
  async postVerificationCode(@User('id') id: number) {
    const { email, code } = await this.userService.generateVerificationCode(id);
    await this.mailService.sendVerificationCode(email, code);
    Logger.log(`회원가입 이메일이 전송되었습니다. ${id} - ${email}`);
    return { data: null, message: ['메일이 성공적으로 전송되었습니다.'] };
  }

  @UseGuards(RegistedUserGuard)
  @Get('verification')
  async checkVerificationCode(
    @User('email') email: string,
    @Query('code') code: undefined | string,
  ) {
    await this.userService.checkVerificationCode(email, code);
    return { data: null, message: ['인증번호가 확인되었습니다.'] };
  }

  @UseGuards(RegistedUserGuard)
  @Post('register/:id')
  async postNewUser(@Body() userDto: UpdateUserDto) {
    const hash = await bycrypt.hash(
      userDto.password,
      Number(process.env.HASH_ROUNDS),
    );

    const { id } = await this.userService.updateNewUser({
      ...userDto,
      password: hash,
    });

    return { message: '회원가입이 완료되었습니다.' };
  }

  @UseGuards(BasicTokenGuard)
  @Post('email')
  async postLoginEmail(@User() user: UserModel, @Req() req: Request) {
    await this.userService.updateLoginAt(user.id);
    const refreshToken = this.authService.createRefreshToken(user);
    this.authService.setRefreshCookie(req.res, refreshToken);
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
  @UseGuards(ActivatedUserGuard)
  @Delete(':id')
  deleteUser(@User('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
