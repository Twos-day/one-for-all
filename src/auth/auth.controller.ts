import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenGuard } from './guard/bear-token.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
    const token = this.authService.extractTokenFromHeader(rowToken, true);
    const session = await this.authService.getSessionUser(token);
    return session;
  }

  // @Post('token/refresh')
  // @UseGuards(RefreshTokenGuard)
  // postTokenRefresh(@Headers('authorization') rowToken: string) {
  //   const token = this.authService.extractTokenFromHeader(rowToken, true);
  //   const newToken = this.authService.rotateToken(token, true);
  //   return { refreshToken: newToken };
  // }

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
    const refreshToken = this.authService.signToken(user, true);

    console.log('cookies', req.cookies);

    req.res.status(200);

    req.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('PROTOCAL') === 'https',
    });

    return { message: 'ok' };
  }

  @Post('register')
  async postRegisterEmail(@Body() userDto: RegisterUserDto) {
    await this.authService.registerWithEmail(userDto);
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
}
