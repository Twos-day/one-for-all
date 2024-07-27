import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { excuteRootDomain } from './auth/util/excute-root-domain';

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  checkRedirect(redirect?: string): boolean {
    if (!redirect) return false;
    const hostname = excuteRootDomain(redirect);

    if (hostname.endsWith('twosday.live') || hostname === 'localhost') {
      return true;
    }

    return false;
  }
}
