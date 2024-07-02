import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bear-token.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @ApiOperation({
    summary: '엑세스 토큰 발급',
    description: '리프레시 토큰을 이용하여 엑세스 토큰을 발급합니다.',
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
  postTokenAccess(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, true);
    const newToken = this.authService.rotateToken(token, false);
    return { accessToken: newToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, true);
    const newToken = this.authService.rotateToken(token, true);
    return { refreshToken: newToken };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@User() user: UserModel) {
    return this.authService.loginUser(user);
  }

  @Post('register/email')
  postRegisterEmail(@Body() userDto: RegisterUserDto) {
    return this.authService.registerWithEmail(userDto);
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
