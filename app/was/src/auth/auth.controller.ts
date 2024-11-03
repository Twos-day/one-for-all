import { getServerUrl } from '@/common/util/getServerUrl';
import { MailService } from '@/mail/mail.service';
import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import { User } from '@/user/decorator/user.decorator';
import { UserModel } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bycrypt from 'bcrypt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleUser } from './decorator/google-user.decorator';
import { KakaoUser } from './decorator/kakao-user.decorator';
import {
  PatchEmailUserDto,
  PostEmailUserDto,
  PostVerificationDto,
} from './dto/email-user.dto';
import { SessionDto } from './dto/session.dto';
import { PatchSocialUserDto, SocialUserDto } from './dto/social-user.dto';
import { AccessGuard, SessoionUserGuard } from './guard/after-login.guard';
import {
  BasicTokenGuard,
  SignupAccessGuard,
  SignupSessionGuard,
} from './guard/before-login.guard';
import { excuteRootDomain } from './util/excute-root-domain';
import {
  getRefreshCookieOptions,
  REFRESH_COOKIE_NAME,
} from './const/tokens.const';

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

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  async socialRoute(
    req: Request,
    socialUser: SocialUserDto,
    accountType: AccountType,
  ) {
    let user = await this.userService.getUserByEmail(socialUser.email);

    if (!user) {
      // 유저가 없으면 새로 생성
      user = await this.userService.registerUser(socialUser);
    }
    const serverUrl = getServerUrl();
    const redirectUrl: string = req.cookies.redirect || serverUrl;

    if (user.accountType && user.accountType !== accountType) {
      // CASE - 1 : 이미 가입된 계정이 다른 소셜 계정으로 로그인 시도
      const cause = `${accountType.toUpperCase()} 계정으로 가입된 사용자가 아닙니다.`;
      return req.res.redirect(
        `${serverUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status === StatusEnum.deactivated) {
      // CASE - 2: 비활성화된 계정
      const cause = '접근할 수 없는 계정입니다.';
      return req.res.redirect(
        `${serverUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`,
      );
    }

    if (user.status === StatusEnum.unauthorized) {
      // CASE - 3: 가입되지 않은 계정 회원가입 페이지 이동
      // 가입전이라 db에 소셜계정 종류, 아바타, 닉네임이 아직 없기때문에
      // callback으로 받은 소셜계정 종류, 아바타, 닉네임을 토큰에 추가해준다.
      user.accountType = accountType;
      user.avatar = socialUser.avatar;
      user.nickname = socialUser.nickname;
      const token = this.authService.signRefreshToken(user);
      return req.res.redirect(`${serverUrl}/signup/register?token=${token}`);
    }

    if (
      user.accountType === accountType &&
      user.status === StatusEnum.activated
    ) {
      // CASE - 4: 로그인 처리
      const refreshToken = this.authService.signRefreshToken(user);

      // refresh 쿠키 저장
      req.res.cookie(
        REFRESH_COOKIE_NAME,
        refreshToken,
        getRefreshCookieOptions(),
      );

      // redirect 쿠키 삭제
      req.res.cookie('redirect', '', {
        maxAge: 0, // delete cookie
        domain: excuteRootDomain(process.env.HOST),
        path: '/',
      });

      return req.res.redirect(redirectUrl);
    }

    throw new InternalServerErrorException('관리자에게 문의하세요.');
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @GoogleUser() googleUser: SocialUserDto,
    @Req() req: Request,
  ) {
    return this.socialRoute(req, googleUser, AccountType.google);
  }

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(
    @KakaoUser() kakaoUser: SocialUserDto,
    @Req() req: Request,
  ) {
    return this.socialRoute(req, kakaoUser, AccountType.kakao);
  }

  @Post('signup')
  async postSignupEmail(@Body() emailUser: PostEmailUserDto) {
    let user = await this.userService.getUserByEmail(emailUser.email);

    if (!user) {
      // 유저가 없으면 새로생성
      user = await this.userService.registerUser(emailUser);
    }

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

    return {
      data: { id: user.id },
      message: ['사용자정보 추가등록을 진행합니다.'],
    };
  }

  @Post('verification/:id')
  async postVerificationCode(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    const { email, code } = await this.userService.generateVerificationCode(
      user.id,
    );
    await this.mailService.sendVerificationCode(email, code);
    Logger.log(`회원가입 이메일이 전송되었습니다. ${id} - ${email}`);
    return { data: null, message: ['메일이 성공적으로 전송되었습니다.'] };
  }

  @Post('verification')
  async checkVerificationCode(@Body() dto: PostVerificationDto) {
    const user = await this.userService.checkVerificationCode(dto);
    user.accountType = AccountType.email; // 토큰에 계정타입 추가
    const token = this.authService.signRefreshToken(user);
    return { data: { token }, message: ['인증번호가 확인되었습니다.'] };
  }

  @Get('verification')
  @UseGuards(SignupSessionGuard)
  async getVerification(@User() user: UserModel) {
    const session = this.authService.generateSessionDto(user);
    return { data: session, message: ['세션이 조회되었습니다.'] };
  }

  @UseGuards(SignupAccessGuard)
  @Post('signup/email')
  async patchSignupEmail(
    @User() user: UserModel,
    @Body() dto: PatchEmailUserDto,
    @Req() req: Request,
  ) {
    dto.password = await bycrypt.hash(
      dto.password,
      Number(process.env.HASH_ROUNDS),
    );

    const patchedUser = await this.userService.patchUser(
      user,
      dto,
      AccountType.email,
    );

    const token = this.authService.signRefreshToken(patchedUser);
    req.res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
    return { data: null, message: ['회원가입이 완료 되었습니다.'] };
  }

  @UseGuards(SignupAccessGuard)
  @Post('signup/social')
  async patchSignupSocial(
    @User() user: UserModel,
    @Body() dto: PatchSocialUserDto,
    @Req() req: Request,
  ) {
    const patchedUser = await this.userService.patchUser(
      user,
      dto,
      user.accountType,
    );
    const token = this.authService.signRefreshToken(patchedUser);
    req.res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
    return { data: null, message: ['회원가입이 완료 되었습니다.'] };
  }

  @UseGuards(BasicTokenGuard)
  @Post('email')
  async postLoginEmail(@User() user: UserModel, @Req() req: Request) {
    const token = this.authService.signRefreshToken(user);
    req.res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
    return { data: { token }, message: ['로그인 되었습니다.'] };
  }

  /**
   * 테스트 로그인
   *
   * 로컬호스트에서만 테스트 로그인 가능
   */
  @Post('email-test')
  @UseGuards(BasicTokenGuard)
  async testLogin(@User() user: UserModel, @Req() req: Request) {
    const origin = excuteRootDomain(req.headers.origin);
    if (origin !== 'localhost') throw new NotFoundException();

    const token = this.authService.signRefreshToken(user);
    req.res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
    return { data: { token }, message: ['로그인 되었습니다.'] };
  }

  @Get('session')
  @ApiOperation({
    summary: '세션 조회',
    description: '리프레시 토큰을 이용하여 세션을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '세션 조회 성공',
    type: SessionDto,
  })
  @UseGuards(SessoionUserGuard)
  async getSession(@User() user: UserModel) {
    const session = this.authService.generateSessionDto(user);
    return { data: { session }, message: ['세션이 조회되었습니다.'] };
  }

  /** 유저정보 수정 */
  // @Patch(':id')
  // async patchUser(@Body() userDto: UpdateUserDto) {
  //   const result = await this.userService.updateUser(userDto);

  //   return { id: result.id, message: '회원정보가 성공적으로 수정되었습니다.' };
  // }

  /** 탈퇴 */
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteUser(@User('id') id: number) {
    await this.userService.deleteUser(id);
    return { data: null, message: ['회원탈퇴가 완료되었습니다.'] };
  }
}
