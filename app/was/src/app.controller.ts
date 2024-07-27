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
    const redirectQuery = this.appService.checkRedirect(redirect)
      ? redirect
      : getServerUrl();

    const refreshCookie = req.cookies.refreshToken;
    const redirectCookie = req.cookies.redirect;

    if (refreshCookie) {
      // 세션이 있을때
      try {
        const redirectUrl = redirectCookie
          ? encodeURI(redirectCookie)
          : redirectQuery;

        this.authService.verifyToken(refreshCookie, true);

        this.authService.setRefreshToken(res, refreshCookie);

        res.cookie('redirect', '', {
          domain: excuteRootDomain(url),
          path: '/',
          maxAge: 0,
        });

        // 쿠키에 저장된 경로로 이동
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

      res.cookie('redirect', redirectQuery, {
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
