import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppService } from './app.service';
import { CustomClassSerializerInterceptor } from './common/intercepter/class-serializer.intercepter';
import { AuthService } from './auth/auth.service';
import { excuteRootDomain } from './auth/util/excute-root-domain';
import { Url } from './common/decorator/url.decorator';
import { getServerUrl } from './common/util/getServerUrl';

@Controller()
@UseInterceptors(CustomClassSerializerInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('/login')
  async getHello(
    @Req() req: Request,
    @Query('redirect')
    redirect: string | undefined,
    @Url() url: string,
    @Res() res: Response,
  ) {
    const cookie = req.cookies.refreshToken;

    const redirectUrl = this.appService.checkRedirect(redirect)
      ? redirect
      : getServerUrl();

    if (cookie) {
      // 세션이 있을때
      try {
        this.authService.verifyToken(cookie, true);
        res.cookie('refreshToken', cookie, {
          domain: excuteRootDomain(redirectUrl),
          path: '/',
        });
        return res.redirect(redirectUrl);
      } catch (e) {
        // 세션이 만료됐을때
        // 리프레시 토큰 삭제
        res.cookie('refreshToken', '', {
          maxAge: 0,
          domain: excuteRootDomain(url),
          path: '/',
        });
        return res.redirect('/login');
      }
    } else {
      // 세션이 없을때
      res.cookie('redirect', redirectUrl, {
        domain: excuteRootDomain(url),
        path: '/',
      });

      const html = await fs.readFile(
        path.resolve(__dirname, '../public/index.html'),
        'utf-8',
      );

      return res.send(html);
    }
  }
}
