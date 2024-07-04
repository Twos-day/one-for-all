import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/bear-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bycrypt from 'bcrypt';
import { StatusEnum } from '@/user/const/status.const';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Post('session')
  @ApiOperation({
    summary: '세션 조회',
    description: '리프레시 토큰을 이용하여 세션을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @UseGuards(RefreshTokenGuard)
  async postSession(@Headers('authorization') rowToken: string) {
    // const token = this.authService.extractTokenFromReq(rowToken, true);
    const session = await this.authService.getSessionUser('token');
    return session;
  }

  @Post('email')
  async postLoginEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
  ) {
    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });
    // const refreshToken = this.authService.signToken(user, true);

    console.log('cookies', req.cookies);

    req.res.status(200);

    req.res.cookie('refreshToken', 'refreshToken', {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('PROTOCAL') === 'https',
    });

    return { message: 'ok' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // 이 메소드는 실제로 아무 작업도 하지 않습니다.
    // 구글 로그인 화면으로 리다이렉트하는 역할을 합니다.
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // 구글 인증이 완료된 후, 사용자 정보를 처리하는 메소드입니다.
    // req.user에 사용자 정보가 담겨있습니다.
    return req.user;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {
    // 이 메소드는 실제로 아무 작업도 하지 않습니다.
    // 카카오 로그인 화면으로 리다이렉트하는 역할을 합니다.
  }

  @Get('callback/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req) {
    // 카카오 인증이 완료된 후, 사용자 정보를 처리하는 메소드입니다.
    return req.user;
  }

  @Post('register')
  async postRegisterEmail(@Body() userDto: RegisterUserDto) {
    const result = await this.userService.registerUser(userDto, false);

    return { id: result.id, message: '이메일이 성공적으로 등록되었습니다.' };
  }

  @Patch('register')
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

  @Post('verification/:id')
  async postVerificationCode(@Param('id') id: string) {
    const { email, code } =
      await this.userService.generateVerificationCode(+id);

    await this.mailService.sendVerificationCode(email, code);

    Logger.log(`회원가입 이메일이 전송되었습니다. ${id} - ${email}`);

    return { message: '메일이 성공적으로 전송되었습니다.' };
  }

  // @Patch(':id')
  // async patchUser(@Body() userDto: UpdateUserDto) {
  //   const result = await this.userService.updateUser(userDto);

  //   return { id: result.id, message: '회원정보가 성공적으로 수정되었습니다.' };
  // }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
