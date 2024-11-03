import { excuteRootDomain } from '../util/excute-root-domain';

export enum TokensEnum {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export const REFRESH_COOKIE_NAME = 'refresh_token';

export const getRefreshCookieOptions = () => ({
  domain: excuteRootDomain(process.env.HOST),
  secure: process.env.PROTOCOL === 'https',
  maxAge: 1000 * 60 * 60 * 24 * 3, // 3일 (밀리초)
  path: '/',
  httpOnly: true,
});
