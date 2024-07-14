import { MailService } from '@/mail/mail.service';
import { AccountType } from '@/user/const/account-type.const';
import { User } from '@/user/decorator/user.decorator';
import { UserModel } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
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
import {
  PatchEmailUserDto,
  PostEmailUserDto,
  PostVerificationDto,
} from './dto/email-user.dto';
import { SessionDto } from './dto/session.dto';
import { PatchSocialUserDto, SocialUserDto } from './dto/social-user.dto';
import {
  BasicTokenGuard,
  SignupAccessGuard,
  SignupSessionGuard,
} from './guard/before-login.guard';
import { AccessGuard, SessoionUserGuard } from './guard/after-login.guard';

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
  googleAuthRedirect(
    @GoogleUser() googleUser: SocialUserDto,
    @Req() req: Request,
  ) {
    return this.authService.veryfySocialUser(
      req,
      googleUser,
      AccountType.google,
    );
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(
    @KakaoUser() kakaoUser: SocialUserDto,
    @Req() req: Request,
  ) {
    return this.authService.veryfySocialUser(req, kakaoUser, AccountType.kakao);
  }

  @Post('signup')
  async postSignupEmail(
    @Body() emailUser: PostEmailUserDto,
    @Req() req: Request,
  ) {
    let user = await this.userService.getUserByEmail(emailUser.email);

    if (!user) {
      // 유저가 없으면 새로생성
      user = await this.userService.registerUser(emailUser);
    }

    this.authService.verifyEmailUser(req, user);
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
    const token = this.authService.generateRefreshToken(user);
    return { data: { token }, message: ['인증번호가 확인되었습니다.'] };
  }

  @Get('verification')
  @UseGuards(SignupSessionGuard)
  async getVerification(@User() user: UserModel) {
    const session = this.authService.createSession(user);
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

    const token = this.authService.generateRefreshToken(patchedUser);
    this.authService.setRefreshToken(req.res, token);
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
    const token = this.authService.generateRefreshToken(patchedUser);
    this.authService.setRefreshToken(req.res, token);
    return { data: null, message: ['회원가입이 완료 되었습니다.'] };
  }

  @UseGuards(BasicTokenGuard)
  @Post('email')
  async postLoginEmail(@User() user: UserModel, @Req() req: Request) {
    const refreshToken = this.authService.generateRefreshToken(user);
    this.authService.setRefreshToken(req.res, refreshToken);
    return { data: null, message: ['로그인 되었습니다.'] };
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
    const session = this.authService.createSession(user);
    return { data: session, message: ['세션이 조회되었습니다.'] };
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
