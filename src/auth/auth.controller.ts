import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bycrypt from 'bcrypt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bear-token.guard';
import { SessionDto } from './dto/session.dto';
import { User } from '@/user/decorator/user.decorator';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { UserModel } from '@/user/entities/user.entity';

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
  async googleAuth(@Req() req: any) {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    // 구글 인증이 완료된 후, 사용자 정보를 처리하는 메소드입니다.
    // req.user에 사용자 정보가 담겨있습니다.
    return req.user;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req: any) {}

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req: any) {
    // 카카오 인증이 완료된 후, 사용자 정보를 처리하는 메소드입니다.
    return req.user;
  }

  @Post('register')
  /** 이메일 회원가입 - 1 */
  async postRegisterEmail(@Body() userDto: RegisterUserDto) {
    const result = await this.userService.registerUser(userDto, false);

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
  async patchNewUser(@Body() userDto: UpdateUserDto) {
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

    console.log('refreshToken', refreshToken);
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
